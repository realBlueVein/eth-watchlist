App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const Watchlist = await $.getJSON('Watchlist.json')
      App.contracts.Watchlist = TruffleContract(Watchlist)
      App.contracts.Watchlist.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.Watchlist = await App.contracts.Watchlist.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderTasks: async () => {
      // Load the total task count from the blockchain
      const taskCount = await App.Watchlist.listCount()
      const $taskTemplate = $('.taskTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= taskCount; i++) {
        // Fetch the task data from the blockchain
        const stocks = await App.Watchlist.stocks(i)
        const taskId = stocks[0].toNumber()
        const taskContent = stocks[1]
        const taskCompleted = stocks[2]
  
        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on('click', App.toggleCompleted)
  
        // Put the task in the correct list
        if (taskCompleted) {
            $('#taskList').append($newTaskTemplate)
        } else {
            $('#completedTaskList').append($newTaskTemplate)
          
        }
  
        // Show the task
        $newTaskTemplate.show()
      }
    },
  
    createTask: async () => {
      App.setLoading(true)
      const content = $('#newTask').val()
      await App.Watchlist.addStock(content)
      window.location.reload()
    },
  
    toggleCompleted: async (e) => {
      App.setLoading(true)
      const taskId = e.target.name
      await App.Watchlist.toggleCompleted(taskId)
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })