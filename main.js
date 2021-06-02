'use strict'
const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element)
const data = Date();
console.log(data)

const criarTabelaPrecos = () =>{
  const sessaoTabelaPrecos = $('.precos').classList.remove('none') 
}

const fecharTabelaPrecos = () =>{
  const sessaoTabelaPrecos = $('.precos').classList.add('none') 
}

const limparInputs = () =>{
  const inputs1 = Array.from($$('.inputs input'));
  const inputs2 = Array.from($$('.precos input'));
  inputs1.forEach(input => input.value = '');
  inputs2.forEach(input => input.value = '');
}

const lerBancoDeDados = () => JSON.parse(localStorage.getItem('db')) ?? [];

const criarNovaLinha = (cliente) => {

  const linhaClienteCadastrado = document.createElement('tr')
    const tbody = $('#cadastros #tbody')
    linhaClienteCadastrado.innerHTML = `    
      <td>${cliente.nome}</td>
      <td>${cliente.placa}</td>
      <td>Data</td>
      <td>Hora</td>
      <td>
        <button>??????</button>
        <button>Editar</button>
        <button>Saída</button>
      </td>
    `
    tbody.appendChild(linhaClienteCadastrado);
}

const limparTela = () =>{
  const tbody = document.getElementById('tbody')
  while(tbody.firstChild){
    tbody.removeChild(tbody.lastChild);
  }
}

const lerTabela = () => {
  const db = lerBancoDeDados();
  limparTela();
  db.forEach(criarNovaLinha)
  
}
 
const exibirClientesNaTela = () =>{
  const bancoDeDados = lerBancoDeDados();
  bancoDeDados.forEach(lerTabela)
}

const mascaraPlaca = (evento) => {
  if($('#placa').value.length == 3){
    $('#placa').value += "-";
  }
  
}



const validarCampos = () => {
  if($('#placa').reportValidity() && $('#nome').reportValidity()){
    return true;
  }
}

const adicionarCliente = () => {
  const db = lerBancoDeDados();
  if(validarCampos()){
    const dadosCliente = {
      nome: $('#nome').value,
      placa: $('#placa').value,
    }
    db.push(dadosCliente)
    localStorage.setItem('db', JSON.stringify(db))
    exibirClientesNaTela()
    limparInputs();
  }
} 

$('#buttonAdicionar').addEventListener('click', adicionarCliente);
$('#buttonPreco').addEventListener('click', criarTabelaPrecos)
$('#buttonCancelar').addEventListener('click', () => {fecharTabelaPrecos(); limparInputs();})
$('#placa').addEventListener('keyup', mascaraPlaca)
$('#placa').addEventListener('keyup', (maiusculas) =>{
  const input = maiusculas.target;
  input.value = input.value.toUpperCase();
})