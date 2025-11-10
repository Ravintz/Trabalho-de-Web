
document.addEventListener('DOMContentLoaded', () => {
  
    let db_imoveis = [];
    function salvarImoveis() {
        localStorage.setItem('imoveisDB', JSON.stringify(db_imoveis));
    }

 
    function carregarImoveis() {
     
        const data = localStorage.getItem('imoveisDB');
        db_imoveis = data? JSON.parse(data) : [];
    }

    function fazerLogin(usuario, senha) {
 
        if (usuario === 'admin' && senha === '1234') {
          
            localStorage.setItem('isLoggedIn', 'true');
       
            window.location.href = 'admin.html';
        } else {
            alert('Usuário ou senha incorretos!');
        }
    }

  
    function fazerLogout() {
        localStorage.removeItem('isLoggedIn');
       
        window.location.href = 'index.html';
    }

   
    function checarAcessoAdmin() {
        if (localStorage.getItem('isLoggedIn')!== 'true') {
            alert('Acesso negado. Por favor, faça o login.');
            window.location.href = 'index.html';
        }
    }

    function adicionarImovel(imovel) {
   
        db_imoveis.push(imovel);
        salvarImoveis();
        alert('Imóvel cadastrado com sucesso!');
    }

 
    function atualizarImovel(id, novosDados) {
     
        const index = db_imoveis.findIndex(imovel => imovel.id === id);
        
        if (index!== -1) {
          
            db_imoveis[index] = {...db_imoveis[index],...novosDados };
            salvarImoveis();
            alert('Imóvel atualizado com sucesso!');
        }
    }

   
    function excluirImovel(id) {
        if (confirm('Tem certeza que deseja excluir este imóvel?')) {
           
            db_imoveis = db_imoveis.filter(imovel => imovel.id!== id);
            salvarImoveis();
            alert('Imóvel excluído com sucesso!');
        
            renderizarTabelaAdmin();
        }
    }
    function renderizarListaPublica(listaDeImoveis) {
        const grid = document.getElementById('property-grid');
        if (!grid) return; 

        grid.innerHTML = ''; 

        if (listaDeImoveis.length === 0) {
            grid.innerHTML = '<p>Nenhum imóvel encontrado.</p>';
            return;
        }

        listaDeImoveis.forEach(imovel => {
            const card = document.createElement('article');
            card.className = 'card-imovel';

            card.innerHTML = `
                <img src="${imovel.imagem_url}" alt="Foto de ${imovel.titulo}">
                <div class="card-content">
                    <h3>${imovel.titulo}</h3>
                    <p class="card-bairro">${imovel.bairro}, ${imovel.cidade}</p>
                    <p class="card-price">R$ ${parseFloat(imovel.preco).toLocaleString('pt-BR')}</p>
                    <p class="card-desc">${imovel.descricao}</p>
                    <span class="card-status">${imovel.status}</span>
                </div>
            `;
          
            grid.appendChild(card);
        });
    }
       
    function filtrarImoveis() {
        const status = document.getElementById('filtro-status').value;
        const tipo = document.getElementById('filtro-tipo').value;
        const cidade = document.getElementById('filtro-cidade').value;

        const listaFiltrada = db_imoveis.filter(imovel => {
        const matchStatus =!status |

 imovel.status === status;
            const matchTipo =!tipo |

 imovel.tipo === tipo;
            const matchCidade =!cidade |

 imovel.cidade === cidade;
            return matchStatus && matchTipo && matchCidade;
        });
    renderizarListaPublica(listaFiltrada);
    }    
    function renderizarTabelaAdmin() {
        const tableBody = document.getElementById('report-table-body');
        if (!tableBody) return; 

        tableBody.innerHTML = ''; 

        db_imoveis.forEach(imovel => {
   
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${imovel.titulo}</td>
                <td>${imovel.tipo}</td>
                <td>R$ ${parseFloat(imovel.preco).toLocaleString('pt-BR')}</td>
                <td>${imovel.status}</td>
                <td>
                    <button class="btn-edit" data-id="${imovel.id}">Editar</button>
                    <button class="btn-delete" data-id="${imovel.id}">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
   
    function carregarFormularioParaEdicao(id) {
        const imovel = db_imoveis.find(imovel => imovel.id === id);
        if (!imovel) return;

      
        document.getElementById('imovel-id').value = imovel.id;
        document.getElementById('imovel-titulo').value = imovel.titulo;
        document.getElementById('imovel-imagem').value = imovel.imagem_url;
        document.getElementById('imovel-preco').value = imovel.preco;
        document.getElementById('imovel-status').value = imovel.status;
        document.getElementById('imovel-tipo').value = imovel.tipo;
        document.getElementById('imovel-cidade').value = imovel.cidade;
        document.getElementById('imovel-bairro').value = imovel.bairro;
        document.getElementById('imovel-descricao').value = imovel.descricao;
        
    
        document.getElementById('btn-cancelar').style.display = 'inline-block';
        
    
        window.scrollTo(0, 0);
    }
    
    
    function resetarFormularioCRUD() {
        document.getElementById('crud-form').reset();
        document.getElementById('imovel-id').value = ''; 
        document.getElementById('btn-cancelar').style.display = 'none';
    }

    const currentPage = window.location.pathname.split('/').pop();

   
    if (currentPage === 'index.html' |

 currentPage === '') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                const usuario = document.getElementById('login-usuario').value;
                const senha = document.getElementById('login-senha').value;
                fazerLogin(usuario, senha);
            });
        }
    }

    
    if (currentPage === 'publico.html') {     
        carregarImoveis();      
        renderizarListaPublica(db_imoveis);    
      
        const btnBuscar = document.getElementById('btn-buscar');
        if(btnBuscar) {
            btnBuscar.addEventListener('click', filtrarImoveis);
        }
    }

   
    if (currentPage === 'admin.html') {
       
        checarAcessoAdmin();
        
      
        carregarImoveis();
       
        renderizarTabelaAdmin();
        
       
        document.getElementById('btn-logout').addEventListener('click', fazerLogout);
        
       
        document.getElementById('btn-cancelar').addEventListener('click', resetarFormularioCRUD);

       
        document.getElementById('crud-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            
            const id = document.getElementById('imovel-id').value;
            const dadosImovel = {
            
                id: id |

 `im_${Date.now()}`,
                titulo: document.getElementById('imovel-titulo').value,
                imagem_url: document.getElementById('imovel-imagem').value,
                preco: parseFloat(document.getElementById('imovel-preco').value), 
                status: document.getElementById('imovel-status').value,
                tipo: document.getElementById('imovel-tipo').value,
                cidade: document.getElementById('imovel-cidade').value,
                bairro: document.getElementById('imovel-bairro').value,
                descricao: document.getElementById('imovel-descricao').value
            };

      
            if (id) {
      
                atualizarImovel(id, dadosImovel);
            } else {
       
                adicionarImovel(dadosImovel);
            }
      
            resetarFormularioCRUD();
            renderizarTabelaAdmin();
        });
        
    
        document.getElementById('report-table-body').addEventListener('click', (e) => {
       
            if (e.target.classList.contains('btn-edit')) {
                const id = e.target.dataset.id;
                carregarFormularioParaEdicao(id);
            }
            
      
            if (e.target.classList.contains('btn-delete')) {
                const id = e.target.dataset.id;
                excluirImovel(id);
      
            }
        });
    }

});