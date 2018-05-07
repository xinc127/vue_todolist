//数据储存
(function () {
	var storage_key = "c_todos"
	window.todoStorage = {
		load() {
			var history = localStorage.getItem(storage_key)
			if(history) {
				return JSON.parse(history)
			} else {
				return []
			}
 		},
 		save(todos) {
 			localStorage.setItem(storage_key, JSON.stringify(todos))
 		}
	}
})();


(function () {

	var filters = {
		all: todos => todos,
		active: todos => todos.filter(todo => !todo.completed),
		completed: todos => todos.filter(todo => todo.completed) 
	}

	//实例化
	var cx_todo = new Vue({
		//挂载元素
		el: ".cx_todolist",
		//属性
		data: {
			newTodo: "",
			todos: todoStorage.load(),
			editedTodo: null,
			todoTitle: ""
		},
		//计算属性
		computed: {

			activeCount() {
				return filters.active(this.todos).length
			},
			completeCount() {
				return filters.completed(this.todos).length
			},

			activeTodo() {
				return filters.active(this.todos)
			},
			completeTodo() {
				return filters.completed(this.todos)
			}
		},

		// 属性观察 
		watch: {
		    todos: {
		    	deep: true,
		        handler: todoStorage.save
		    }
		},

		//方法集合
		methods: {
			addTodo() {
				this.newTodo = this.newTodo.trim()
				if(!this.newTodo) {
					return 
				}
				this.todos.unshift({
					title: this.newTodo,
					completed: false
				})
				this.newTodo = ''
			},
			removeTodo(todo) {
				var index = this.todos.indexOf(todo)
				this.todos.splice(index, 1)
			},
			clear() {
				this.todos = []
			},

			editTodo(todo) {
				this.editedTodo = todo
				this.todoTitle = todo.title

			},
			doneEdit(todo) {
				if(!this.editedTodo) {
					return
				}
				this.editedTodo = null
				todo.title = todo.title.trim()
				if(!todo.title) {
					this.removeTodo(todo)
				}

			},
			cancelEdit(todo) {
				if(this.editedTodo) {
					todo.title = this.todoTitle
					this.editedTodo = null
				}
			}


		},
		//指令集合
		directives: {
			focus: {
				update(el) {
					el.focus()
				}
			}
		}
	});

})();


