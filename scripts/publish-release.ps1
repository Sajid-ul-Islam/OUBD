param (
    [string]$tag = "v1.0.0",
    [string]$releaseName = "One Ummah BD - v1.0.0",
    [string]$apkPath = "releases/OneUmmahBD-release-1.0.0.apk"
)

$ErrorActionPreference = "Stop"

Write-Host "1. Checking tag $tag..."
$existingTag = git tag -l $tag
if (-not $existingTag) {
    Write-Host "Creating git tag $tag..."
    git tag -a $tag -m "Release $tag"
}

Write-Host "Pushing git tag $tag to origin..."
git push origin $tag

Write-Host "2. Getting GitHub token from git credentials..."
$credInput = "protocol=https`nhost=github.com`n"
$credOutput = $credInput | git credential fill
$tokenLine = $credOutput | Where-Object { $_ -like "password=*" }
if (-not $tokenLine) {
    throw "Could not retrieve password/token from git credential helper"
}
$token = $tokenLine.Substring("password=".Length).Trim()

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept"        = "application/vnd.github+json"
    "User-Agent"    = "OneUmmahBD-Release-Script"
}

Write-Host "3. Creating GitHub release..."
$repo = "Sajid-ul-Islam/OUBD"
$releaseBody = @"
Release v1.0.0 for One Ummah BD.

Includes standalone ARM release APK compatible with physical Android smartphones (`arm64-v8a` and `armeabi-v7a`).

- **APK Name:** OneUmmahBD-release-1.0.0.apk
"@

$postData = @{
    tag_name         = $tag
    target_commitish = "main"
    name             = $releaseName
    body             = $releaseBody
    draft            = $false
    prerelease       = $false
} | ConvertTo-Json

$createReleaseUri = "https://api.github.com/repos/$repo/releases"

try {
    $release = Invoke-RestMethod -Uri $createReleaseUri -Method Post -Headers $headers -Body $postData -ContentType "application/json"
} catch {
    Write-Host "Release may already exist, checking..."
    $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/tags/$tag" -Method Get -Headers $headers
}

$uploadUrl = $release.upload_url -replace '\{\?name,label\}', "?name=OneUmmahBD-release-1.0.0.apk"
Write-Host "Release created successfully (ID: $($release.id))."

Write-Host "4. Uploading APK asset to release..."
$resolvedApkPath = Resolve-Path $apkPath
$apkBytes = [System.IO.File]::ReadAllBytes($resolvedApkPath)

$uploadHeaders = @{
    "Authorization" = "Bearer $token"
    "Accept"        = "application/vnd.github+json"
    "User-Agent"    = "OneUmmahBD-Release-Script"
    "Content-Type"  = "application/vnd.android.package-archive"
}

$uploadResponse = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers $uploadHeaders -Body $apkBytes

Write-Host "5. Upload complete!"
Write-Host "Release URL: $($release.html_url)"
Write-Host "Download URL: $($uploadResponse.browser_download_url)"
