# Script de Deploy Automatizado Hostinger - Sentinela (sentinela.hubdigital360.com)
# Squad A-Team | Mario Henrique (PO) & Antigravity AI

$env:Path = "C:\Program Files\nodejs;" + $env:Path

$FtpServer   = "82.25.72.209"
$FtpUser     = "u576215103.sentinela.hubdigital360.com"
$FtpPass     = "#kppfF=@/cbnM9^b"
$SiteUrl     = "https://sentinela.hubdigital360.com"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 INICIANDO DEPLOY EM PRODUÇÃO: $SiteUrl " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Função de Upload FTP Recursivo
function Upload-FtpDirectory($localPath, $remoteUrl, $username, $password) {
    try {
        $dirReq = [System.Net.FtpWebRequest]::Create($remoteUrl)
        $dirReq.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $dirReq.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $dirReq.GetResponse().Close()
    } catch {
        # Diretório já existe
    }

    $files = Get-ChildItem -Path $localPath

    foreach ($file in $files) {
        $itemRemoteUrl = "$remoteUrl/$($file.Name)"
        
        if ($file.PSIsContainer) {
            Upload-FtpDirectory -localPath $file.FullName -remoteUrl $itemRemoteUrl -username $username -password $password
        } else {
            Write-Host "  -> Enviando: $($file.Name)" -ForegroundColor Gray
            try {
                $ftpReq = [System.Net.FtpWebRequest]::Create($itemRemoteUrl)
                $ftpReq.Credentials = New-Object System.Net.NetworkCredential($username, $password)
                $ftpReq.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
                $ftpReq.UseBinary = $true

                $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
                $ftpReq.ContentLength = $fileBytes.Length

                $requestStream = $ftpReq.GetRequestStream()
                $requestStream.Write($fileBytes, 0, $fileBytes.Length)
                $requestStream.Close()
                $ftpReq.GetResponse().Close()
            } catch {
                Write-Host "⚠️ Erro ao enviar $($file.Name): $_" -ForegroundColor Red
            }
        }
    }
}

# 1. Compila o Frontend React com Vite no SSD Local (evita travamentos no Google Drive)
Write-Host "`n[1/3] Compilando Frontend React em disco SSD local..." -ForegroundColor Yellow
$tempBuild = Join-Path $env:TEMP "sentinela_build"
if (Test-Path $tempBuild) { Remove-Item -Recurse -Force $tempBuild -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Path $tempBuild -Force | Out-Null

Copy-Item -Recurse -Force "src", "public", "index.html", "package.json", "tsconfig.json", "vite.config.ts", "tailwind.config.js", "postcss.config.js" "$tempBuild/"

$npmCmd = "C:\Program Files\nodejs\npm.cmd"
$npxCmd = "C:\Program Files\nodejs\npx.cmd"

Push-Location $tempBuild
try {
    if (Test-Path $npmCmd) { & $npmCmd install --no-audit --no-fund } else { npm install --no-audit --no-fund }
    if (Test-Path $npxCmd) { & $npxCmd vite build } else { npx vite build }
} finally {
    Pop-Location
}

if (-not (Test-Path "$tempBuild\dist")) {
    Write-Host "❌ Erro ao compilar o frontend React com Vite." -ForegroundColor Red
    exit 1
}

# 2. Envia Frontend compilado diretamente para o FTP da Hostinger
Write-Host "`n[2/3] Enviando Frontend compilado para Hostinger via FTP ($FtpServer)..." -ForegroundColor Yellow
$distPath = "$tempBuild\dist"
Upload-FtpDirectory -localPath $distPath -remoteUrl "ftp://$FtpServer" -username $FtpUser -password $FtpPass

# 3. Envia Backend API PHP se existir
if (Test-Path "$PSScriptRoot\api") {
    Write-Host "`n[3/3] Enviando Backend API PHP para Hostinger via FTP..." -ForegroundColor Yellow
    Upload-FtpDirectory -localPath "$PSScriptRoot\api" -remoteUrl "ftp://$FtpServer/api" -username $FtpUser -password $FtpPass
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " ✅ DEPLOY FINALIZADO COM SUCESSO! " -ForegroundColor Green
Write-Host " 🌐 Acesse: $SiteUrl " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
