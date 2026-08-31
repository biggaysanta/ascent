# Define the project root (current directory), archive directory, and search term
$ProjectRoot = Get-Location
$ArchiveDir = Join-Path -Path $ProjectRoot -ChildPath "archive"
$SearchTerm = "expiryDate"

# 1. Create the archive directory if it doesn't already exist
if (-not (Test-Path -Path $ArchiveDir)) {
    Write-Host "Creating archive directory at '$ArchiveDir'" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $ArchiveDir | Out-Null
}

# 2. Recursively find files containing the search term
# We filter out the archive directory so we don't search files we've already moved
Write-Host "Searching for '$SearchTerm' in '$ProjectRoot'..."
$Matches = Get-ChildItem -Path $ProjectRoot -File -Recurse |
    Where-Object { $-.DirectoryName -notmatch "^$([regex]::Escape($ArchiveDir))" } |
    Select-String -Pattern $SearchTerm -List

if (-not $Matches) {
    Write-Host "No files found containing the term '$SearchTerm'." -ForegroundColor Yellow
    exit
}

# 3. Extract unique parent directories from the matching files
$DirsToMove = $Matches.Path | Get-Item | Select-Object -ExpandProperty Directory -Unique

# 4. Move each directory to the archive folder
foreach ($Dir in $DirsToMove) {
    # Safety check: Do not move the project root itself if a match was in a root file
    if ($Dir.FullName -eq $ProjectRoot.Path) {
        Write-Warning "A match was found in the project root. Skipping moving the root directory."
        continue
    }

    Write-Host "Moving directory '$($Dir.FullName)' to '$ArchiveDir'..."
    
    try {
        Move-Item -Path $Dir.FullName -Destination $ArchiveDir -Force -ErrorAction Stop
        Write-Host "Successfully moved '$($Dir.Name)'" -ForegroundColor Green
    } catch {
        Write-Error "Failed to move directory '$($Dir.FullName)'. Error: $-"
    }
}

Write-Host "Archiving complete." -ForegroundColor Cyan
