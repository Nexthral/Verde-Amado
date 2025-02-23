// Cabeçalho e estrutura de Link API
const token = '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'; // Substitua pelo seu token
const owner = 'Nexthral'; // Nome do dono do repositório
const repo = 'Verde-Amado'; // Nome do repositório
const categoriesDir = 'categorias'; // Subdiretório onde as categorias estão localizadas
const imagesDir = 'categorias/img'; // Subdiretório onde as imagens estão localizadas

// URL base para a API do GitHub
const apiBaseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

// Função para buscar as categorias
async function getCategories() {
  const url = `${apiBaseUrl}${categoriesDir}`;

  try {
    // Fazendo a requisição para a API do GitHub para obter a lista de categorias
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }

    const data = await response.json();

    // Garantir que a resposta seja um array
    if (!Array.isArray(data)) {
      console.error('A resposta da API não é um array', data);
      return;
    }

    // Obter os nomes das categorias
    const categoryNames = data.map(item => item.name);
    displayCategories(categoryNames); // Passa os nomes das categorias para exibir
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
  }
}

// Função para buscar os dados dos arquivos JSON das categorias através da API do GitHub
async function getCategoryData(categoryName) {
  const categoryUrl = `${apiBaseUrl}${categoriesDir}/${categoryName}`;

  try {
    // Fazendo a requisição para a API do GitHub para obter os arquivos JSON da categoria
    const response = await fetch(categoryUrl, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const data = await response.json();

    // Verifica se a resposta contém arquivos
    if (!Array.isArray(data)) {
      console.error('Erro: resposta não contém arquivos JSON válidos', data);
      return;
    }

    // Filtra apenas os arquivos JSON
    const jsonFiles = data.filter(item => item.name.endsWith('.json'));

    // Processa cada arquivo JSON
    for (let file of jsonFiles) {
      const productData = await fetchProductData(file.download_url);
      const imgData = file.name.replace('.json', ''); // Remove a extensão .json para pegar o nome da imagem
      
      const imgUrl = await fetchImageUrl(imgData);
      
      renderProduct(productData, imgUrl, categoryName);
    }
  } catch (error) {
    console.error('Erro ao buscar dados da categoria:', error);
  }
}

// Função para buscar dados de um arquivo JSON de produto através da API do GitHub
async function fetchProductData(jsonUrl) {
  try {
    // Modificando para buscar o arquivo através da API do GitHub (não raw.githubusercontent.com)
    const response = await fetch(jsonUrl, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do produto');
    }

    const jsonData = await response.json();  // Converte para objeto JSON
    return jsonData; // Retorna os dados do produto
  } catch (error) {
    console.error('Erro ao buscar dados do produto:', error);
    return null;
  }
}

// Função para buscar a imagem do produto através da API do GitHub
async function fetchImageUrl(imageName) {
  const imageUrlJpg = `${apiBaseUrl}${imagesDir}/${imageName}.jpg`;
  const responseJpg = await fetch(imageUrlJpg, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (responseJpg.ok) {
    return imageUrlJpg;
  }

  // Se não encontrar a imagem .jpg, tenta com .png
  const imageUrlPng = `${apiBaseUrl}${imagesDir}/${imageName}.png`;
  const responsePng = await fetch(imageUrlPng, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (responsePng.ok) {
    return imageUrlPng;
  }

  // Se não encontrar, tenta com .jpeg
  const imageUrlJpeg = `${apiBaseUrl}${imagesDir}/${imageName}.jpeg`;
  const responseJpeg = await fetch(imageUrlJpeg, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  return responseJpeg.ok ? imageUrlJpeg : null; // Retorna null se nenhuma imagem for encontrada
}

// Função para renderizar o produto na interface
function renderProduct(productData, imgUrl, categoryName) {
  const categoryElement = document.getElementById(`${categoryName}Category`);
  if (!categoryElement) return;

  const productContainer = document.createElement('div');
  productContainer.classList.add('panelproducts');
  
  const productImg = document.createElement('img');
  productImg.src = imgUrl || 'img/default.jpg'; // Usa imagem padrão se não encontrar
  productContainer.appendChild(productImg);
  
  const productPrice = document.createElement('p');
  productPrice.textContent = `R$ ${productData.valor.toFixed(2)}`;
  productContainer.appendChild(productPrice);
  
  const productName = document.createElement('span');
  productName.textContent = productData.nome;
  productContainer.appendChild(productName);
  
  categoryElement.querySelector('.products').appendChild(productContainer);
}

// Função para verificar e exibir categorias
function displayCategories(categories) {
  // Se houver mais de 3 categorias, exibimos apenas as 3 primeiras
  const categoriesToDisplay = categories.slice(0, 3);

  // Exibe as categorias First, Second e Third
  const categoryIds = ['FirstCategory', 'SecondCategory', 'ThirdCategory'];

  categoryIds.forEach((categoryId, index) => {
    const categoryElement = document.getElementById(categoryId);
    if (categoriesToDisplay[index]) {
      categoryElement.style.display = 'flex'; // Exibe a categoria
      categoryElement.querySelector('h1').textContent = categoriesToDisplay[index];
      getCategoryData(categoriesToDisplay[index]); // Carrega os produtos da categoria
    } else {
      categoryElement.style.display = 'none'; // Oculta a categoria se não houver dados
    }
  });
}

// Função principal para iniciar o processo
async function init() {
  // Buscando as categorias
  await getCategories();
}

// Chama a função init quando o documento carregar
document.addEventListener('DOMContentLoaded', init);
