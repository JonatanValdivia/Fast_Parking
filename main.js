'use strict'

const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element)


function animacoes(){
  const sessaoPrecos = $('.sessaoPrecos');
  sessaoPrecos.style.animation = 'go-back 1s';
}

const criarTabelaPrecos = () =>{
  const sessaoTabelaPrecos = $('.precos').classList.remove('none') 
  animacoes();
}

const fecharTabelaPrecos = () =>{
  const sessaoTabelaPrecos = $('.precos').classList.add('none') 
}

const lerBancoDeDados = () => JSON.parse(localStorage.getItem('db')) ?? [];

const setarBancoDeDados = (db) => localStorage.setItem('db', JSON.stringify(db))

const criarComprovante = (cliente) =>{
  const div = document.createElement('div');
  const sessaoPrecos = $('#sessaoComprovante');
  div.innerHTML = `
    <h3>Comprovante</h3>
    <hr>
    <div id="dados">
      <label for="nome">Nome: ${cliente.nome}</label>
      <label for="placa">Placa: ${cliente.placa}</label>
      <label for="data">Data: ${cliente.data}</label>
      <label for="hora">Hora: ${cliente.hora}</label>
    </div>
    <div id="acaoImpressao">
      <button>Imprimir</button>
      <button>Cancelar</button>
    </div>
  `;

  sessaoPrecos.appendChild(div);
}

const limparInputs = () =>{
  const inputs1 = Array.from($$('.inputs input'));
  const inputs2 = Array.from($$('.precos input'));
  inputs1.forEach(input => input.value = '');
  inputs2.forEach(input => input.value = '');
}

const data = () =>{
  let data = new Date();
  let dia = data.getDate();
  let mes = data.getMonth()+1;
  let ano = data.getFullYear();

  if(dia.toString().length == 1) dia = '0'+dia;
  if(mes.toString().length == 1) mes = '0'+mes;

  return `${dia}/${mes}/${ano}`
  
}

const horaSaida = (primeiraHora, demaisHoras) =>{
  const segundosUmaHora = 60 * 60;
  let hora = segundosUmaHora / 3600;
  let primeiraHoraCliente = primeiraHora * hora;
  let horaSaida = new Date().getHours() + primeiraHoraCliente;
  let minutos = new Date().getMinutes();
  return horaSaida + ":" + minutos;

}

const horaEntrada = () =>{
  let hora = new Date().getHours();
  let minutos = new Date().getMinutes();
  return hora + ":" + minutos;
}

const formPreco = () =>{
  const horaCliente ={
    primeiraHora: $('#primeiraHora').value,
    demaisHoras: $('#demaisHoras').value
  }
  return horaSaida(horaCliente.primeiraHora, horaCliente.demaisHoras)  
} 

const criarNovaLinha = (cliente, indice) => {

  const linhaClienteCadastrado = document.createElement('tr')
    const tbody = $('#cadastros #tbody')
    linhaClienteCadastrado.innerHTML = `    
      <td>${cliente.nome}</td>
      <td>${cliente.placa}</td>
      <td>${cliente.data}</td>
      <td>${cliente.hora}</td>
      <td>
        <button type='button' id="telaComprovante" data-acao="comprovante-${indice}">Comp.</button>
        <button type='button' data-acao="editar-${indice}">Editar</button>
        <button type='button' data-acao="sair-${indice}">Saída</button>
      </td>
    `
    tbody.appendChild(linhaClienteCadastrado);
}

const saidaDoCliente = (indice) => {
  const db = lerBancoDeDados();
  const resposta = confirm("Deseja realmente sair? Esta ação irá deletar o registro!")
  if(resposta){
    db.splice(indice, 1); //Deletar o indice, e somente ele mesmo, sem mais algum outro cliente/linha/dados
    setarBancoDeDados(db);
    lerTabela();
  }
}

const edicaoDoCliente = (indice) =>{
  const db = lerBancoDeDados();
    $('#nome').value = db[indice].nome;
    $('#placa').value = db[indice].placa;
    $('#nome').dataset.indice = indice;
}

const acoesBotoes = (evento) =>{
  let botaoClicado = evento.target
  if(botaoClicado.type === 'button'){
    const acao = botaoClicado.dataset.acao.split('-')
    //console.log(acao)
    if(acao[0] === 'sair'){
      saidaDoCliente(acao[1]);//Para a deleção dessa linha, precisamos necessariamente do id/indice, que é a posição um. A posição zero é o que deve ser feito, no caso a ação[0] == 'sair' ou editar
    } else if(acao[0] === 'editar'){
      edicaoDoCliente(acao[1]);
    }else if(acao[0] === 'comprovante'){
        const db = lerBancoDeDados();
        db.forEach(cliente => criarComprovante(cliente))
    }
  }
}

const limparTela = () =>{
  const tbody = document.getElementById('tbody')
  while(tbody.firstChild){
    tbody.removeChild(tbody.lastChild);
  }
}

const editarCliente = (cliente, indice) =>{
  const resposta = confirm("Deseja mesmo editar esse registro?");
  if(resposta){
    const db = lerBancoDeDados()
    db[indice] = cliente
    setarBancoDeDados(db);
  }
}

const lerTabela = () => {
  const db = lerBancoDeDados();
  limparTela();
  db.forEach(criarNovaLinha)
  //db.forEach(cliente => criarComprovante(cliente))
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
  if(validarCampos()){
    const dadosCliente = {
      nome: $('#nome').value,
      placa: $('#placa').value,
      data: data(),
      hora: horaEntrada()
    }
    const index = $('#nome').dataset.indice;
    if(index == ''){
      const db = lerBancoDeDados();
      db.push(dadosCliente);
      localStorage.setItem('db', JSON.stringify(db))
    }else{
      editarCliente(dadosCliente, index);
    }
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
$('.table').addEventListener('click', acoesBotoes);
$('#salvarPrecos').addEventListener('click', () => {
  adicionarCliente()
})

lerTabela()