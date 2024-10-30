const addProjectBtn = document.getElementById('addProjectBtn');
const projectForm = document.getElementById('projectForm');
const saveProjectBtn = document.getElementById('saveProjectBtn');
const projectsList = document.getElementById('projectsList');

let editingProjectId = null; // Armazena o ID do projeto que está sendo editado

// Função para carregar projetos
async function loadProjects() {
    const response = await fetch('https://projetos-production.up.railway.app/api/projetos'); // URL atualizada
    const projects = await response.json();
    projectsList.innerHTML = ''; // Limpa a lista antes de adicionar novos projetos
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.description}">
            <h3>${project.description}</h3>
            <p>Autor: ${project.author}</p>
            <div class="icon-container">
                <i class="fas fa-edit icon edit" onclick="editProject(${project.id})"></i>
                <i class="fas fa-trash-alt icon" onclick="deleteProject(${project.id})"></i>
            </div>
        `;
        projectCard.onclick = () => {
            window.location.href = `project.html?id=${project.id}`;
        };
        projectsList.appendChild(projectCard);
    });
}

// Carrega os projetos ao iniciar a página
window.onload = loadProjects;

addProjectBtn.onclick = () => {
    projectForm.style.display = 'block';
    editingProjectId = null; // Reseta o ID de edição
    resetForm(); // Limpa o formulário
};

saveProjectBtn.onclick = async () => {
    const imageUrl = document.getElementById('imageUrl').value;
    const videoUrl = document.getElementById('videoUrl').value;
    const description = document.getElementById('description').value;
    const author = document.getElementById('author').value;

    // Verifica se estamos editando um projeto ou criando um novo
    if (editingProjectId) {
        // Atualiza o projeto
        const response = await fetch(`https://projetos-production.up.railway.app/api/projetos/${editingProjectId}`, { // URL atualizada
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl, videoUrl, description, author })
        });

        if (response.ok) {
            loadProjects(); // Carrega os projetos novamente
            projectForm.style.display = 'none';
            resetForm(); // Limpa o formulário
        } else {
            alert('Erro ao atualizar o projeto');
        }
    } else {
        // Cria um novo projeto
        const response = await fetch('https://projetos-production.up.railway.app/api/projetos', { // URL atualizada
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl, videoUrl, description, author })
        });

        if (response.ok) {
            loadProjects(); // Carrega os projetos novamente
            projectForm.style.display = 'none';
            resetForm(); // Limpa o formulário
        } else {
            alert('Erro ao salvar o projeto');
        }
    }
};

// Função para deletar projeto
async function deleteProject(id) {
    if (confirm('Você tem certeza que deseja deletar este projeto?')) {
        const response = await fetch(`https://projetos-production.up.railway.app/api/projetos/${id}`, { // URL atualizada
            method: 'DELETE'
        });

        if (response.ok) {
            loadProjects(); // Carrega os projetos novamente
        } else {
            alert('Erro ao deletar o projeto');
        }
    }
}

// Função para editar projeto
async function editProject(id) {
    const response = await fetch(`https://projetos-production.up.railway.app/api/projetos/${id}`); // URL atualizada
    const project = await response.json();
    
    // Preenche o formulário com os dados do projeto
    document.getElementById('imageUrl').value = project.imageUrl;
    document.getElementById('videoUrl').value = project.videoUrl;
    document.getElementById('description').value = project.description;
    document.getElementById('author').value = project.author;

    projectForm.style.display = 'block'; // Exibe o formulário
    editingProjectId = id; // Armazena o ID do projeto a ser editado
}

// Função para limpar o formulário
function resetForm() {
    document.getElementById('imageUrl').value = '';
    document.getElementById('videoUrl').value = '';
    document.getElementById('description').value = '';
    document.getElementById('author').value = '';
}
