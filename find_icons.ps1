param(
    [string]$Path = ".",
    [string]$Regex = '\\\\\[icon\s+name="([^"]+)"\s+prefix="([^"]+)"\\\\\]'
)

# Recursively search for .md files and match the regex using Select-String
Get-ChildItem -Path $Path -Recurse -File | Where-Object { $_.Extension -eq '.md' } | Select-String -Pattern $Regex | ForEach-Object {
    $match = $_.Matches[0]
    $name = $match.Groups[1].Value
    $prefix = $match.Groups[2].Value
    [PSCustomObject]@{
        File = $_.Path
        Line = $_.LineNumber
        Name = $name
        Prefix = $prefix
        Match = $_.Line.Trim()
    }
} | Format-Table -AutoSize