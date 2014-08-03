# URL to web eg http://sitename
$webUrl = Read-Host "Enter URL of web"

# Display name of site column - eg Harvey Balls
$fieldName = Read-Host "Enter Site Column Name"

# Where is script eg ~sitecollection/Style Library/custom/HarveyBalls.js
# Note this can be multiple scripts separated with a |
$path = Read-Host "Enter path to script"

$web = Get-SPWeb $webUrl
$field = $web.Fields[$fieldName]
$field.JSLink = $path
$field.Update($true_)
$web.Dispose()
