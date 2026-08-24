# Script de Deploy Automatizado Hostinger - Sentinela (monitor.hubdigital360.com)
# Squad A-Team | Mario Henrique (PO) & Antigravity AI

$FtpServer   = "ftp.monitor.hubdigital360.com"
$FtpUser     = "u576215103.monitor"
$FtpPass     = "U=w>T@i4"
$FtpRemoteDir= "/home/u576215103/domains/monitor.hubdigital360.com/public_html"
$SiteUrl     = "https://monitor.hubdigital360.com"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 INICIANDO DEPLOY EM PRODUÇÃO: $SiteUrl " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Compila o Frontend React com Vite
Write-Host "`n[1/4] Compilando Frontend React (Vite)..." -ForegroundColor Yellow
npx vite build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar o frontend React com Vite." -ForegroundColor Red
    exit 1
}

# 2. Prepara Pasta de Pacote de Deploy
$deployDir = "deploy_package"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}

New-Item -ItemType Directory -Path $deployDir | Out-Null

Write-Host "`n[2/4] Copiando arquivos estáticos do Frontend (/dist -> /deploy_package)..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "dist/*" "$deployDir/"

# 3. Copia API Backend PHP se existir
if (Test-Path "api") {
    Write-Host "`n[3/4] Incluindo Backend API PHP (/api -> /deploy_package/api)..." -ForegroundColor Yellow
    Copy-Item -Recurse -Force "api" "$deployDir/"
}

# 4. Função de Upload FTP Recursivo
Write-Host "`n[4/4] Enviando arquivos para Hostinger via FTP ($FtpServer)..." -ForegroundColor Yellow

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

# Executa Upload FTP
$baseUrl = "ftp://$FtpServer$FtpRemoteDir"
Upload-FtpDirectory -localPath $deployDir -remoteUrl $baseUrl -username $FtpUser -password $FtpPass

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " ✅ DEPLOY FINALIZADO COM SUCESSO! " -ForegroundColor Green
Write-Host " 🌐 Acesse: $SiteUrl " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
