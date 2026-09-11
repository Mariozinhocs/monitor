# -*- coding: utf-8 -*-
import os
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime

def create_docx(file_path):
    # Namespaces
    w_ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    r_ns = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    
    # Minimal OpenXML structure
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    doc_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="1E293B"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>"""

    # Build document.xml
    doc_body = []
    
    def p(text="", bold=False, size=22, color="1E293B", align="left", space_before=100, space_after=100, bullet=False):
        b_tag = "<w:b/>" if bold else ""
        jc_tag = f'<w:jc w:val="{align}"/>' if align != "left" else ""
        num_pr = """<w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>""" if bullet else ""
        
        return f"""<w:p>
          <w:pPr>
            {jc_tag}
            <w:spacing w:before="{space_before}" w:after="{space_after}" w:line="276" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/>
              {b_tag}
              <w:sz w:val="{size}"/>
              <w:color w:val="{color}"/>
            </w:rPr>
            <w:t xml:space="preserve">{text}</w:t>
          </w:r>
        </w:p>"""

    def heading1(text):
        return p(text, bold=True, size=32, color="1E1B4B", space_before=300, space_after=120)

    def heading2(text):
        return p(text, bold=True, size=26, color="4338CA", space_before=220, space_after=100)

    def heading3(text):
        return p(text, bold=True, size=24, color="0F172A", space_before=160, space_after=80)

    def table_row(cells, is_header=False, bg="FFFFFF"):
        cells_xml = []
        for text in cells:
            bg_xml = f'<w:shd w:val="clear" w:color="auto" w:fill="{bg}"/>' if bg != "FFFFFF" else ""
            bold_flag = "<w:b/>" if is_header else ""
            color_val = "0F172A" if not is_header else "1E1B4B"
            cell = f"""<w:tc>
              <w:tcPr>
                <w:tcW w:w="3000" w:type="dxa"/>
                {bg_xml}
                <w:tcMar>
                  <w:top w:w="120" w:type="dxa"/>
                  <w:bottom w:w="120" w:type="dxa"/>
                  <w:left w:w="150" w:type="dxa"/>
                  <w:right w:w="150" w:type="dxa"/>
                </w:tcMar>
              </w:tcPr>
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/>
                    {bold_flag}
                    <w:sz w:val="20"/>
                    <w:color w:val="{color_val}"/>
                  </w:rPr>
                  <w:t xml:space="preserve">{text}</w:t>
                </w:r>
              </w:p>
            </w:tc>"""
            cells_xml.append(cell)
        return f"""<w:tr>{''.join(cells_xml)}</w:tr>"""

    def table(rows_data, header_bg="F1F5F9", alt_bg="F8FAFC"):
        tbl_rows = []
        for i, row in enumerate(rows_data):
            if i == 0:
                tbl_rows.append(table_row(row, is_header=True, bg=header_bg))
            else:
                bg = alt_bg if i % 2 == 0 else "FFFFFF"
                tbl_rows.append(table_row(row, is_header=False, bg=bg))
                
        return f"""<w:tbl>
          <w:tblPr>
            <w:tblW w:w="0" w:type="auto"/>
            <w:tblBorders>
              <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
              <w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
              <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
              <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
              <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
              <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            </w:tblBorders>
          </w:tblPr>
          {''.join(tbl_rows)}
        </w:tbl>"""

    def callout_box(title, text):
        return f"""<w:tbl>
          <w:tblPr>
            <w:tblW w:w="0" w:type="auto"/>
            <w:tblBorders>
              <w:left w:val="single" w:sz="24" w:space="0" w:color="4F46E5"/>
              <w:top w:val="none"/>
              <w:bottom w:val="none"/>
              <w:right w:val="none"/>
            </w:tblBorders>
          </w:tblPr>
          <w:tr>
            <w:tc>
              <w:tcPr>
                <w:tcW w:w="9000" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="EEF2FF"/>
                <w:tcMar>
                  <w:top w:w="160" w:type="dxa"/>
                  <w:bottom w:w="160" w:type="dxa"/>
                  <w:left w:w="200" w:type="dxa"/>
                  <w:right w:w="200" w:type="dxa"/>
                </w:tcMar>
              </w:tcPr>
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/>
                    <w:b/>
                    <w:sz w:val="22"/>
                    <w:color w:val="3730A3"/>
                  </w:rPr>
                  <w:t xml:space="preserve">{title}</w:t>
                </w:r>
              </w:p>
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/>
                    <w:sz w:val="20"/>
                    <w:color w:val="1E293B"/>
                  </w:rPr>
                  <w:t xml:space="preserve">{text}</w:t>
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
        </w:tbl>"""

    # Assemble Document Content
    doc_body.append(p("SENTINELA.AI", bold=True, size=44, color="4338CA", align="center", space_before=100, space_after=50))
    doc_body.append(p("Social Listening, Monitoramento Aberto & Gestão de Crises em Tempo Real", bold=False, size=24, color="64748B", align="center", space_before=0, space_after=300))
    
    doc_body.append(callout_box("RELATÓRIO EXECUTIVO & GUIA COMPLETO DE TESTES", 
                               "Documento oficial de validação, arquitetura de engenharia e roteiro de homologação da plataforma Sentinela.ai em ambiente de produção."))

    doc_body.append(heading1("1. Metadados do Projeto & Squad"))
    meta_table = [
        ["Propriedade", "Detalhes"],
        ["Plataforma", "Sentinela.ai — Social Listening & Crisis Intelligence"],
        ["URL Oficial em Produção", "https://sentinela.hubdigital360.com"],
        ["Líder do Projeto / PO", "Mario Henrique (mariozinhocs)"],
        ["Agente de Engenharia & IA", "Antigravity AI (Squad A-Team)"],
        ["Versão Homologada", "v1.2 (Headless Instagram Collector + Safe Placeholders)"],
        ["Data de Publicação", datetime.now().strftime("%d/%m/%Y")]
    ]
    doc_body.append(table(meta_table))

    doc_body.append(heading1("2. Roteiro Passo a Passo de Testes"))
    doc_body.append(p("Siga os passos abaixo para experimentar e validar todos os módulos interativos do sistema:"))

    doc_body.append(heading2("Passo 1: Configuração de Marca / Alvo de Monitoramento"))
    doc_body.append(p("1. No menu superior (Navbar), clique no botão 'O que Monitorar: [Nome]' (ícone de alvo)."))
    doc_body.append(p("2. No modal, defina um novo Alvo (ex: Nubank, Prefeitura de SP, Petrobras ou seu próprio negócio)."))
    doc_body.append(p("3. Adicione palavras-chave e termos de crise (ex: lentidão, suporte, reclamação, problema)."))
    doc_body.append(p("4. Clique em 'Salvar e Reconfigurar Alvo'."))
    doc_body.append(p("-> Resultado Esperado: Todos os gráficos, indicadores de sentimento, volume e nuvem de tópicos são recalculados instantaneamente e salvos no navegador."))

    doc_body.append(heading2("Passo 2: Varredura com Radar em Tempo Real"))
    doc_body.append(p("1. Na barra superior, clique no botão 'Radar Ao Vivo' (ícone de atualização)."))
    doc_body.append(p("2. O sistema ativa o coletor em background e o motor de análise semântica de IA."))
    doc_body.append(p("-> Resultado Esperado: O botão entra em rotação ('Varrendo Redes...'), exibe notificação de confirmação e adiciona a nova postagem analisada com IA no topo do feed."))

    doc_body.append(heading2("Passo 3: Robô Headless de Coleta Aberta do Instagram"))
    doc_body.append(p("1. Na barra superior, clique no botão com gradiente rosa 'Robô Instagram'."))
    doc_body.append(p("2. Observe que todos os formulários e campos possuem placeholders estritamente genéricos e anônimos (Diretriz do Squad A-Team)."))
    doc_body.append(p("3. Conecte a conta de serviço do coletor para manter os cookies de raspagem ativos no backend PHP/MySQL."))

    doc_body.append(heading2("Passo 4: Resumo Executivo Gerado por IA (AI Insights)"))
    doc_body.append(p("1. Clique no botão roxo 'AI Insights' no topo da tela."))
    doc_body.append(p("2. O modal apresenta:"))
    doc_body.append(p("   - Diagnóstico semântico de sentimento em linguagem natural."))
    doc_body.append(p("   - Principais fatores de tração positiva e motivos de rejeição negativa."))
    doc_body.append(p("   - Estimativa de risco de crise e plano estratégico de contenção recomendado."))
    doc_body.append(p("3. Você pode utilizar o botão 'Copiar Resumo' ou exportar o parecer executivo."))

    doc_body.append(heading2("Passo 5: Central de Gestão de Crises & Contenção"))
    doc_body.append(p("1. No menu lateral, selecione 'Gestão de Crises' (ou clique no escudo de alerta no topo)."))
    doc_body.append(p("2. Analise os incidentes classificados por severidade (Crítico, Médio, Baixo) e probabilidade de contágio."))
    doc_body.append(p("3. Clique em 'Marcar como Contido' para simular a atuação do time de relações públicas."))
    doc_body.append(p("-> Resultado Esperado: O incidente passa para o status 'Resolvido' e o Health Score da marca é restaurado."))

    doc_body.append(heading2("Passo 6: Feed de Menções & Filtros por Nuvem de Tópicos"))
    doc_body.append(p("1. No menu lateral, acesse 'Feed de Menções'."))
    doc_body.append(p("2. Aplique filtros por canal (Instagram, TikTok, X, YouTube, Notícias) e por sentimento."))
    doc_body.append(p("3. Retorne ao 'Painel Radar' e clique em qualquer hashtag na Nuvem de Tópicos para ver o filtro aplicado automaticamente."))

    doc_body.append(heading2("Passo 7: Comparativo de Planos & Gestão de Usuários"))
    doc_body.append(p("1. Clique na insígnia 'ENTERPRISE' no topo para abrir a matriz comparativa de planos (Basic, Pro, Enterprise)."))
    doc_body.append(p("2. No menu lateral, acesse 'Gestão de Usuários' para consultar métricas de administradores, cadastrar operadores e visualizar logs de auditoria."))

    doc_body.append(heading1("3. Arquitetura Técnica Implementada"))
    doc_body.append(p("O Sentinela.ai opera com uma arquitetura desacoplada de alto desempenho:"))
    
    arch_table = [
        ["Camada", "Tecnologia", "Função & Responsabilidade"],
        ["Frontend SPA", "React 18 + TypeScript + Vite + Tailwind CSS", "Interface responsiva de alta estética, dark mode, gráficos e radar."],
        ["Backend API", "PHP 8.2 RESTful (Hostinger Cloud)", "Endpoints de autenticação, ingestão, feed e persistência de sessões."],
        ["Coletor Aberto", "Headless Scraper (Instagram Web API)", "Extração de postagens públicas, reels, autor, engajamento e legendas sem depender de aprovação da Meta."],
        ["Motor de IA", "IA Semântica & Diagnóstico Preditivo", "Classificação de sentimento, detecção de gatilhos de crise e recomendações de PR."],
        ["Banco de Dados", "MySQL Relacional", "Armazenamento estruturado de usuários, menções, alertas e jobs de coleta."]
    ]
    doc_body.append(table(arch_table))

    doc_body.append(heading1("4. Diretrizes de Segurança & Placeholders"))
    doc_body.append(callout_box("DIRETRIZ OFICIAL SQUAD A-TEAM: PLACEHOLDERS GENÉRICOS", 
                               "Todos os formulários, telas de autenticação e modais de integração foram padronizados com placeholders anônimos e genéricos (ex: 'Digite seu usuário ou e-mail'). Nomes reais ou pessoais foram permanentemente expurgados."))

    doc_body.append(p("Relatório gerado automaticamente pelo squad A-Team. Todos os direitos reservados ao Sentinela.ai.", bold=False, size=18, color="94A3B8", align="center", space_before=400, space_after=100))

    # Assemble complete document.xml
    doc_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(doc_body)}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>"""

    # Create ZIP/DOCX
    with zipfile.ZipFile(file_path, 'w', zipfile.ZIP_DEFLATED) as docx:
        docx.writestr('[Content_Types].xml', content_types)
        docx.writestr('_rels/.rels', rels)
        docx.writestr('word/_rels/document.xml.rels', doc_rels)
        docx.writestr('word/document.xml', doc_xml)
        docx.writestr('word/styles.xml', styles_xml)

if __name__ == "__main__":
    out_dir = r"g:\Meu Drive\Dev's\Sentinela"
    doc1 = os.path.join(out_dir, "Relatorio-Executivo-e-Guia-Sentinela.docx")
    doc2 = os.path.join(out_dir, "public", "Relatorio-Executivo-e-Guia-Sentinela.docx")
    create_docx(doc1)
    create_docx(doc2)
    print(f"DOCX created successfully at:\n- {doc1}\n- {doc2}")
