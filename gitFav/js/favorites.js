import { GitHubUser } from "./githubUser.js"

// classe para lógica dos dados (como estão estruturados)

export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)  
    this.load()

    
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []   

  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }


  async add(username){
    try{

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GitHubUser.search(username)
      if(user.login === undefined){
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()

    } catch (error){
      alert(error.message)
    }
  }

  delete(user){
    //Higher-order fuctions (map, filter, find, reduce) - principio de imutabilidade
    const filteredEntities = this.entries.filter((entry => entry.login !== user.login))

    this.entries = filteredEntities
    this.update()
    this.save()
  } 

}


// classe para vizualização e eventos no HTML

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector("tbody");

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('.search button');
      addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update(){
    this.removeAllTr()
    this.noFavoritesLayout()

    this.entries.forEach(user => {
     const row = this.createRow()
     row.querySelector('.user img'). src = `https://github.com/${user.login}.png`
     row.querySelector('.user img').alt = `Imagem de ${user.name}`
     row.querySelector('.user p').textContent = user.name
     row.querySelector('.user a').href = `https://github.com/${user.login}`
     row.querySelector('.user span').textContent = user.login
     row.querySelector('.repositories').textContent = user.public_repos
     row.querySelector('.followers').textContent = user.followers

     row.querySelector('.remove').onclick =() => {
      const isOk = confirm('Tem certeza que desja deletar esta linha?')
      if (isOk) {
        this.delete(user)
      }
     }

     this.tbody.append(row)
    })
  }

  createRow(){

    const tr = document.createElement("tr")
    tr.innerHTML  = `

      <td class="user">
      <img src="" alt="Imagem de Juliana">
      <a href="https://github.com/julianamarroncelli" target="_blank">
        <p> Juliana </p>
        <span> julianamarroncelli</span>
      </a>
        </td>
        <td class="repositories"> 3 </td>
        <td class="followers"> 50 </td>
        <td class="remove"> 
          <a> Remover </a>
        </td>

    `
    return tr
   
  }

  removeAllTr(){
 

     this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }

  noFavoritesLayout(){
    if(this.entries.length ===0){
      this.root.querySelector('.noFavorites').classList.remove('hide')

    } else{
      this.root.querySelector('.noFavorites').classList.add('hide')
    }
  }
}



