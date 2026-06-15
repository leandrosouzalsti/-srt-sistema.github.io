// CONFIGURAÇÕES DOS ENDEREÇOS DE WEBHOOK DO DISCORD
const Config = {
    webhookRecrutamentos: "https://discord.com/api/webhooks/1514957328925855875/EHuz3k2zALFtub1SZjO7koo37RQTFyFSjwCVBHaqqsQiGW-uPmNCiF9fPn2BzWR8vREL",
    webhookPromocao: "https://discord.com/api/webhooks/1514980310318583858/EL1p2zU7xPPWSoiArBOLD-MBRBnjA_T0DbVWAG3-JuH9MhM7G50IdeJ62IT5rOwqFTVF",
    webhookAplicarAdv: "https://discord.com/api/webhooks/1514985416728776724/RSBI-yBza7Z-FlC475lLXMHBwv_JMDwaS54eNx_qyZtFoto2YMaylrmM8-cKH_xT4b2_",
    webhookConfirmarAdv: "https://discord.com/api/webhooks/1514986296379183124/BkPLp4Lsjs7WDTRIoa05Avb4Qruua3rKm7nW0B7kojqpna84nXifYQq2mcEOOdzqWg9L",
    webhookSolicitarCursos: "https://discord.com/api/webhooks/1516051951954038815/yZSDzdly5gFydIifV4iQ2H__Zfr1GdEUlGy1zNNVy2XDoEopCW-fDI9NN-rAaEHOStWl",
    webhookPagamentoCursos: "https://discord.com/api/webhooks/1516052149207830670/_7NAsCeGwhQHj0MyXNhATpKQ_mi4qqtPDoDiDDda1yYsnQXon2yLcV3bJ_cLMrwSfOa7",
    webhookAprovacaoCursos: "https://discord.com/api/webhooks/1516052366821163028/aC-BpI63tujf1f9fJZZyIAWAA0rnVK40VshyUVvqtNbO-oda5zKJQkIl1qMXTfr2xoGo",
    webhookCertificadosCursos: "https://discord.com/api/webhooks/1516053416265388194/rgH5gumCh8MowKt6tDXVt1cNvsi_ZAInrOfkSUWy0KJKNvSmjOMzQOV_R_7QkykJQid-"
};

// TOAST NOTIFICATIONS SYSTEM
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
        <span>${icon} &nbsp;${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    // Auto remove toast after 5s
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

// XMLHTTPREQUEST / FETCH FOR WEBHOOKS
function dispararWebhook(url, payload, msgSucesso, formElement = null, redirectUrl = null) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                showToast(msgSucesso, 'success');
                if (formElement) {
                    formElement.reset();
                    redefinirDatasAtuais();
                }
                if (redirectUrl) {
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1500);
                }
            } else {
                showToast('Erro no envio. Código: ' + xhr.status, 'error');
            }
        }
    };
    
    xhr.send(JSON.stringify(payload));
}

// SETUP DATE INPUTS TO TODAY
function redefinirDatasAtuais() {
    const hoje = new Date().toISOString().split('T')[0];
    const inputsData = ['iniData', 'naoIniData', 'novData', 'ausDataInicio', 'ausDataFim', 'proData', 'rebData', 'limpaData', 'bl7Data', 'permData'];
    inputsData.forEach(id => {
        const input = document.getElementById(id);
        if (input) { 
            input.value = hoje; 
        }
    });
}

// INITIALIZE SCRIPTS ON DOM CONTENT LOADED
window.addEventListener('DOMContentLoaded', () => {
    redefinirDatasAtuais();
    
    // Auto load pending warnings if on warning page
    if (document.getElementById('bloco-adv-pendentes')) {
        renderizarListaPendencias();
    }
});

// LOCALSTORAGE FOR PENDING WARNINGS
function obterAdvertenciasPendentes() {
    const data = localStorage.getItem('listaAdvertenciasPendentes');
    return data ? JSON.parse(data) : [];
}

function salvarAdvertenciasPendentes(lista) {
    localStorage.setItem('listaAdvertenciasPendentes', JSON.stringify(lista));
}

function adicionarAdvertencia(adv) {
    const lista = obterAdvertenciasPendentes();
    lista.push(adv);
    salvarAdvertenciasPendentes(lista);
    renderizarListaPendencias();
}

function renderizarListaPendencias() {
    const bloco = document.getElementById('bloco-adv-pendentes');
    const container = document.getElementById('lista-adv-dinamica');
    if (!bloco || !container) return;

    const lista = obterAdvertenciasPendentes();
    container.innerHTML = "";

    if (lista.length === 0) {
        bloco.style.display = "none";
        return;
    }

    bloco.style.display = "block";

    lista.forEach((adv) => {
        const card = document.createElement('div');
        card.className = "card-adv-individual";
        card.innerHTML = `
            <div class="info-pendente">
                <strong>Mecânico:</strong> ${adv.mecanico} (ID: ${adv.passaporte})<br>
                <strong>Motivo:</strong> ${adv.motivo} | <strong>Multa:</strong> ${adv.consequencia} (N° ${adv.numAdv})
            </div>
            <div class="linha-confirmacao">
                <div class="form-group">
                    <label style="font-size:11px;">➔ DATA DO PAGAMENTO:</label>
                    <input type="date" id="data-adv-${adv.idUnico}" required>
                </div>
                <button type="button" class="btn-mini-submit" onclick="confirmarPagamentoIndividual(${adv.idUnico})">Confirmar Pago</button>
            </div>`;
        container.appendChild(card);
        
        const inputData = document.getElementById(`data-adv-${adv.idUnico}`);
        if (inputData) {
            inputData.value = new Date().toISOString().split('T')[0];
        }
    });
}

function confirmarPagamentoIndividual(idUnico) {
    let lista = obterAdvertenciasPendentes();
    const idx = lista.findIndex(i => i.idUnico === idUnico);
    if (idx === -1) return;
    
    const adv = lista[idx];
    const inputData = document.getElementById(`data-adv-${idUnico}`);
    const dtIn = inputData ? inputData.value : '';
    
    if (!dtIn) {
        showToast("Selecione a data de liquidação.", "warning");
        return;
    }
    
    const dtFmt = dtIn.split('-').reverse().join('/');
    const confirmText = `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n✅ **COMPROVANTE DE PAGAMENTO DE ADVERTÊNCIA**\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n➔ **MECÂNICO:** ${adv.mecanico}\n➔ **PASSAPORTE (ID):** ${adv.passaporte}\n➔ **VALOR PAGO:** ${adv.consequencia}\n➔ **ADVERTÊNCIA N°:** ${adv.numAdv}\n➔ **DATA DO ACERTO:** ${dtFmt}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`;
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", Config.webhookConfirmarAdv, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                showToast('Comprovante de pagamento enviado!', 'success');
                lista.splice(idx, 1);
                salvarAdvertenciasPendentes(lista);
                renderizarListaPendencias();
            } else {
                showToast('Erro ao confirmar pagamento. Código: ' + xhr.status, 'error');
            }
        }
    };
    xhr.send(JSON.stringify({ content: confirmText }));
}
