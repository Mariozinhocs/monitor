@echo off
chcp 65001 > nul
cls
title Sentinela.ai - Central de Coleta Local em Tempo Real

:MENU
cls
echo ======================================================================
echo   🛡️  SENTINELA.AI - CENTRAL DE COLETA LOCAL EM TEMPO REAL
echo   Squad A-Team ^| Mario Henrique (PO) ^& Antigravity AI
echo ======================================================================
echo.
echo   [1] Iniciar Coleta Automática de Perfil (ex: davidalmeidaoficial, nubank)
echo   [2] Conectar sua conta do Instagram (Abre navegador 1x para salvar login)
echo   [3] Coletar informando Cookie sessionid
echo   [4] Abrir o Sentinela.ai no Navegador
echo   [5] Sair
echo.
echo ======================================================================
set /p OPCAO="Escolha uma opção [1-5]: "

if "%OPCAO%"=="1" goto COLETAR_AUTO
if "%OPCAO%"=="2" goto CONECTAR_LOGIN
if "%OPCAO%"=="3" goto COLETAR_COOKIE
if "%OPCAO%"=="4" goto ABRIR_SITE
if "%OPCAO%"=="5" goto SAIR

echo Opção inválida!
timeout /t 2 > nul
goto MENU

:COLETAR_AUTO
cls
echo ======================================================================
echo   [OPÇÃO 1] COLETA AUTOMÁTICA DE PERFIL
echo ======================================================================
echo.
set /p TARGET="Informe o @username do perfil (Padrao: davidalmeidaoficial): "
if "%TARGET%"=="" set TARGET=davidalmeidaoficial

set /p POSTS="Quantidade de publicações a coletar (Padrão: 5): "
if "%POSTS%"=="" set POSTS=5

echo.
echo ⏳ Executando varredura local em segundo plano...
python local_instagram_collector.py --target %TARGET% --max %POSTS%
echo.
pause
goto MENU

:CONECTAR_LOGIN
cls
echo ======================================================================
echo   [OPÇÃO 2] CONEXÃO E SALVAMENTO DE SESSÃO
echo ======================================================================
echo.
echo Abrindo navegador Chromium para você entrar no Instagram...
python local_instagram_collector.py --login
echo.
pause
goto MENU

:COLETAR_COOKIE
cls
echo ======================================================================
echo   [OPÇÃO 3] COLETA COM COOKIE SESSIONID
echo ======================================================================
echo.
set /p TARGET="Informe o @username do perfil (Padrao: davidalmeidaoficial): "
if "%TARGET%"=="" set TARGET=davidalmeidaoficial

set /p SESSID="Cole o valor do cookie sessionid: "
if "%SESSID%"=="" (
    echo Cookie não pode ser vazio.
    pause
    goto MENU
)

set /p POSTS="Quantidade de publicações a coletar (Padrão: 5): "
if "%POSTS%"=="" set POSTS=5

echo.
echo ⏳ Executando coleta autenticada...
python local_instagram_collector.py --target %TARGET% --sessionid %SESSID% --max %POSTS%
echo.
pause
goto MENU

:ABRIR_SITE
start https://sentinela.hubdigital360.com/
goto MENU

:SAIR
echo Saindo...
exit
