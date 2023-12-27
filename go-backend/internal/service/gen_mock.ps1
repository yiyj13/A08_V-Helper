# 生成 mock 文件的 powershell 脚本

$files = @(
  "article.go",
  "clinic.go",
  "message.go",
  "profile.go",
  "reply.go",
  "temperture_record.go",
  "user.go",
  "vaccination_record.go",
  "vaccine.go"
)

foreach ($file in $files) {
    $outputFileName = $file -replace "\.go$", "_mock.go"
    $packageName = "service"

    $mockgenCommand = "mockgen -source='$file' -destination='$outputFileName' -package='$packageName'"
    
    Write-Host "Executing: $mockgenCommand"
    
    # Run the mockgen command
    Invoke-Expression $mockgenCommand
}
