Param (
  [Parameter(Mandatory=$true,Position=1)] 
  [String] $siteUrl,
  [String] $listName = "",
  [int] $batchSize = 100,
  [String] $reportName = "export.csv",
  [switch]$Delete,
  [switch]$EmptyRecyleBin,
  [switch]$NoChecks
)

$SPSnapin=Get-PSSnapin | ? { $_.Name -eq "Microsoft.SharePoint.Powershell" } 
if ($SPSnapin -eq $null) {
  Add-PSSnapin -Name Microsoft.SharePoint.Powershell
}

function Is-ValidList($list) {
	if ($list.BaseType -ne "DocumentLibrary") { 
		return $false;
	}
	if (($list.Title -eq "Form Templates") `
    -or ($list.Title -eq "Site Assets") `
    -or ($list.Title -eq "Documents") `
    -or ($list.Title -eq "Shared Documents") `
    -or ($list.Title -eq "Home Documents") `
    -or ($list.Title -eq "Site Pages") `
    -or ($list.Title.StartsWith("Permissions")) `
    -or ($list.Title.StartsWith("0Ave")) `
    -or ($list.Title -eq "Converted Forms") `
    -or ($list.Title -eq "List Template Gallery") `
    -or ($list.Title -eq "Master Page Gallery") `
    -or ($list.Title -eq "Solution Gallery") `
    -or ($list.Title -eq "Theme Gallery") `
    -or ($list.Title -eq "Customized Reports") `
    -or ($list.Title -eq "Reporting Templates") `
    -or ($list.Title -eq "Theme Gallery") `
    -or ($list.Title -eq "Web Part Gallery") `
    -or ($list.Title.StartsWith("wfpub")) `
    -or ($list.Title -eq "Style Library")) {
		return $false;
	}
	return $true;	
}


function Query($list) {
		$query = New-Object Microsoft.SharePoint.SPQuery 
		$query.Query =  
			"   <Where> 
				<And>
				<And>
				<Eq> 
					<FieldRef Name='FSObjType' /> 
					<Value Type='Integer'>1</Value> 
				</Eq> 				
				<Eq> 
					<FieldRef Name='FolderChildCount' /> 
					<Value Type='Integer'>0</Value> 
				</Eq> 
				</And> 				
				<Eq> 
					<FieldRef Name='ItemChildCount' /> 
					<Value Type='Integer'>0</Value> 
				</Eq> 
				</And>
			</Where>" 
		$query.ViewFieldsOnly = $false 
		$query.QueryThrottleMode = 0
		$query.ViewAttributes = "Scope='RecursiveAll'"
		$items = $list.GetItems($query)
		return $items;
}

function Report($list, $items, $csvObj) {
	foreach ($item in $items)
	{
		$itemObj = New-Object PSObject
		$itemUrl = $list.ParentWeb.Site.MakeFullUrl($item.Folder.ServerRelativeUrl)
		$itemObj | Add-Member -MemberType NoteProperty -Name "Folder URL" -Value $itemUrl
		$itemObj | Add-Member -MemberType NoteProperty -Name "File Count" -Value $item.Folder.Files.Count
		$index = $csvObj.Add($itemObj)
		$itemObj = $null
	}
}

function Batch-Delete($list, $items, $batchSize, $doChecks) {

  $batch = "<?xml version=`"1.0`" encoding=`"UTF-8`"?><Batch>"
  $i = 0
  foreach ($item in $items)
  {
    $i++
    write-host "`rProcessing ID: $($item.ID) ($i of $batchSize)" -nonewline
	if ($doChecks) {
		if ($item.File -ne $null) {
			Throw  "item was unexpected file $item.File.ServerRelativeUrl"
		}	
		if ($item.Folder.ItemCount -gt 0) {
			Throw  "item was unexpected non-empty folder $item.Folder.ServerRelativeUrl"	
		}
	}
	
    $batch += "<Method><SetList Scope=`"Request`">$($list.ID)</SetList><SetVar Name=`"ID`">$($item.ID)</SetVar><SetVar Name=`"Cmd`">Delete</SetVar><SetVar Name=`"owsfileref`">$($item.Folder.ServerRelativeUrl)</SetVar></Method>"

    if ($i -ge $batchSize) { break }
  }
  $batch += "</Batch>"
  
  $web = $list.ParentWeb; 
  $result = $web.ProcessBatchData($batch)
}

Write-Host "---- Started   ----"
$doChecks = $true;
if ($NoCheck) {
	$doChecks = $false;
}
$doReport = $true;
if ($reportName -eq "") {
	$doReport = $false;
}
$csvObj= new-object System.Collections.ArrayList($null)
$site = Get-SPSite($siteUrl);
foreach ($web in $site.AllWebs) {
	Write-Host "`rProcessing W:$($web.ServerRelativeUrl) for empty folders"
	foreach ($list in $web.Lists) {
		if ((Is-ValidList $list) -eq $false) {
			continue;
		}	
		$listTitle = $list.Title;
		if (($listName -ne "") -and ($listTitle -ne $listName)) {
			Write-Host "`rSkipping  $($list.RootFolder.ServerRelativeUrl)"
			continue;
		}	
		Write-Host "`rProcessing L:$($list.RootFolder.ServerRelativeUrl) for empty folders"
		do
		{
			$items = Query $list
			$count = ($items | measure).Count
			$remaining = (($items -ne $null) -and ($count -gt 0))
			if ($remaining -eq $false) {
				break;
			}
			if ($doReport) {
				Report $list $items $csvObj
			}
			Write-Host "`r$($list.RootFolder.ServerRelativeUrl) - $count folders remaining" -nonewline
			Write-Host 
			if ($Delete) { } else {
				break;
			}
			Batch-Delete $list $items $batchSize $doChecks $csvObj
		} while ($remaining -eq $true)		
	}
	if ($EmptyRecyleBin) {
		Write-Host "`rEmptying Recycle Bin:$($web.ServerRelativeUrl)"
		$web.RecycleBin.DeleteAll()
	}
	#$web.RecycleBin.RestoreAll()
	$web.Dispose();
}
$site.Dispose();
if (($csvObj.Count -gt 0) -and ($reportName -ne "")) {
	$csvObj | Export-Csv -Path $reportName -NoTypeInformation
}
Write-Host "---- Completed ----"
