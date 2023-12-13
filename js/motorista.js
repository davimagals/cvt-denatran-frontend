
// Variáveis globais.
let formMotorista = null
let motoristaModal = null
let flagNovo = null

// Carregar todos os motorista.
function carregarDados() {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Sucesso.
                const resposta = this.responseText
                const dados = JSON.parse(resposta)

                mostrarDados(dados.data)
            } else {
                // Error.

            }
        }
    }
    xhttp.open('GET', 'http://localhost:3000/api/motorista')
    xhttp.send()
}

// Mostrar dados.
function mostrarDados(dados) {
    let tbody = document.querySelector('#tabela-dados')
    tbody.innerHTML = ''

    for(let motorista of dados) {
        let tr = document.createElement('tr')

        let tdc = document.createElement('td')
        let tdn = document.createElement('td')
        let tdd = document.createElement('td')

        let txtc = document.createTextNode(motorista.cnh)
        let txtn = document.createTextNode(motorista.nome)
        let txtd = document.createTextNode(formatarData(motorista.data_nascimento))

        tdc.appendChild(txtc)
        tdn.appendChild(txtn)
        tdd.appendChild(txtd)

        tr.appendChild(tdc)
        tr.appendChild(tdn)
        tr.appendChild(tdd)

        tr.dataset.cnh = motorista.cnh
        tr.addEventListener('click', buscarMotorista)

        tbody.appendChild(tr)
    }
}

// Buscar um motorista.
function buscarMotorista() {
    const cnh = this.dataset.cnh

    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Sucesso.
                const resposta = this.responseText
                const dados = JSON.parse(resposta)

                mostrarUmMotorista(dados.data[0])
            } else {
                // Error.
            }
        }
    }
    xhttp.open('GET', `http://localhost:3000/api/motorista/${cnh}/endereco`)
    xhttp.send()
}

// Carregar estados.
function carregarEstados() {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Sucesso.
                const resposta = this.responseText
                const dados = JSON.parse(resposta)
                mostrarEstados(dados.data)
            } else {
                // Error.
            }
        }
    }
    xhttp.open('GET', 'http://localhost:3000/api/estado/')
    xhttp.send()
}
carregarEstados()

// Mostrar os estados.
function mostrarEstados(estados) {
    let selectEstado = document.querySelector('#selectEstado')

    for(let estado of estados) {
        let option = document.createElement('option')
        option.value = estado.id

        let nome = document.createTextNode(estado.nome)
        option.appendChild(nome)

        selectEstado.appendChild(option)
    }
}

// Mostrar um motorista.
function mostrarUmMotorista(motorista) {
    if (motorista.cnh == '') {
        flagNovo = true
    } else {
        flagNovo = false
    }

    let inputCnh = document.querySelector('#inputCnh')
    let inputNome = document.querySelector('#inputNome')
    let inputData = document.querySelector('#inputData')

    let inputEndId = document.querySelector('#inputEndId')
    let inputRua = document.querySelector('#inputRua')
    let inputNum = document.querySelector('#inputNum')
    let inputCom = document.querySelector('#inputCom')
    let inputBairro = document.querySelector('#inputBairro')
    let inputCidade = document.querySelector('#inputCidade')
    let selectEstado = document.querySelector('#selectEstado')

    inputCnh.value = motorista.cnh
    inputNome.value = motorista.nome
    inputData.value = formatarData(motorista.data_nascimento)

    inputEndId.value = motorista.endereco_id
    inputRua.value = motorista.rua
    inputNum.value = motorista.numero
    inputCom.value = motorista.complemento
    inputBairro.value = motorista.bairro
    inputCidade.value = motorista.cidade
    selectEstado.value = motorista.estado_id

    motoristaModal = new bootstrap.Modal('#motoristaModal')
    motoristaModal.show()
}

// Adicionar um novo motorista.
function adicionarMotorista() {
    const novoMotorista = {
        cnh: '',
        nome: '',
        data_nascimento: '',
        endereco_id: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado_id: ''
    }

    mostrarUmMotorista(novoMotorista)
}

// Preparar validação.
function prepararValidacao() {
    formMotorista = document.querySelector('.needs-validation')

    formMotorista.addEventListener('submit', (event) => {
        formMotorista.classList.add('was-validated')

        event.preventDefault()
        event.stopPropagation()

        if (formMotorista.checkValidity()) {
            salvar()
        }
    }, false)
}
prepararValidacao()

// Salvar motorista.
function salvar() {
    let inputCnh = document.querySelector('#inputCnh')
    let inputNome = document.querySelector('#inputNome')
    let inputData = document.querySelector('#inputData')

    let inputEndId = document.querySelector('#inputEndId')
    let inputRua = document.querySelector('#inputRua')
    let inputNum = document.querySelector('#inputNum')
    let inputCom = document.querySelector('#inputCom')
    let inputBairro = document.querySelector('#inputBairro')
    let inputCidade = document.querySelector('#inputCidade')
    let selectEstado = document.querySelector('#selectEstado')

    const motorista = {
        cnh: inputCnh.value,
        nome: inputNome.value,
        data_nascimento: inputData.value,
        endereco_id: inputEndId.value,
        rua: inputRua.value,
        numero: inputNum.value,
        complemento: inputCom.value,
        bairro: inputBairro.value,
        cidade: inputCidade.value,
        estado_id: selectEstado.value
    }

    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Sucesso.
                console.dir(this.responseText)

                motoristaModal.hide()
                carregarDados()
            } else {
                // Erro.
                console.dir(this.status)
            }
        }
    }

    if (flagNovo) {
        xhttp.open('POST', 'http://localhost:3000/api/motorista')
    } else {
        xhttp.open('PUT', 'http://localhost:3000/api/motorista/'+ motorista.cnh)
    }

    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(motorista))
}

// Formatar data.
function formatarData(dataEntrada) {
    if (dataEntrada == '') {
        return ''
    }

    const data = new Date(dataEntrada)

    const ano = data.getFullYear()

    let mes = data.getMonth() + 1
    if (mes < 10) {
        mes = '0'+ mes
    }

    let dia = data.getDate()
    if (dia < 10) {
        dia = '0'+ dia
    }

    return dia +'/'+ mes +'/'+ ano
}