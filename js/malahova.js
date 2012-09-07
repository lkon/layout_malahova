/**
 * @fileOverview Сценарий для страницы Dasha Malahova предусматривает 
 * один глобальный объект malahova с методом init, получаемым в результате 
 * объявления и немедленного выполнения анонимной функции, содержащей 
 * частные члены - функции и объекты, отвечающие за поведение элементов страницы:
 * конструктор PopUp, создающий всплывающие окна, 
 * объекты auth & tags, предоставляющие интерфейс задания поведения элементов всплывающих окон,
 * объект slideshow, отвечающий за работу слайдшоу и
 * объект cookAdvices - за дозагрузку советов с сервера с помощью ajax
 */
var malahova = (function() {
	/**
	 * Объект имеет метод загрузки сценария из внешнего источника
	 * и свойство, где сохранен адрес библиотеки jQuery последней версии
	 * на хосте googleapis.com 
	 * @type { {init:function, jQ: String} }
	 */
	var	loadingScriptOut = {	
		/**
		 * @author <a href=' http://stevesouders.com/efws/script-onload.php'>Стив Соудерс</a>
		 * @param {String} src - адрес скрипта, который должен быть загружен
		 * @param {Function} callback - функция будет вызвана после успешной загрузки внешнего скрипта
		 * @param {Element} appendTo - html-элемент, куда будет загружен внешний скрипт, default: head.
		 */
		init : function(src, callback, appendTo) {
			/**
			 * сценарий, загружаемый на страницу из внешнего источника
			 * @type {Element} 
			 */
			var script = document.createElement("script");

			if (script.readyState && !script.onload) {
				script.onreadystatechange = function() {
					if ((script.readyState === 'loaded' || script.readyState === "complete")
						&& !script.onloadDone) {
						script.onloadDone = true;
						callback();
					}
				};
			} else {
				script.onload = function() {
					if (!script.onloadDone) {
						script.onloadDone = true;
						callback();
					}
				};
			}
			script.type = 'text/javascript';
			script.src = src;
			if (!appendTo) {
				appendTo = document.documentElement.children[0];
			}
			appendTo.appendChild(script);
		},
		jQ : "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
	};
	/**
	 * Объект имеет методы - функции-обертки для многократной установки
	 * обработчиков событий
	 * 
	 * @type evt
	 * @type { {add: Function, remove: Function} }
	 */
	var evt = (function() {
		if (document.addEventListener) {
			return {
				/**
				 * Установка события
				 * 
				 * @memberOf evt
				 * @type {function}
				 * @param {Element} el - элемент, на котором запускается событие
				 * @param {String} type - тип события
				 * @param {function} fn - функция - обработчик события
				 */
				add : function(el, type, fn) {
					el.addEventListener(type, fn, false);
				},
				/**
				 * Удаление события
				 * 
				 * @memberOf evt
				 * @type {function}
				 * @param {Element} el - элемент, на котором запускается событие
				 * @param {String} type - тип события
				 * @param {function} fn - функция - обработчик события
				 */
				remove : function(el, type, fn) {
					el.removeEventListener(type, fn, false);
				}
			};
		} else if (document.attachEvent) { // IE
			return {
				/**
				 * Установка события
				 * 
				 * @memberOf evt
				 * @type {function}
				 * @param {Element} el - элемент, на котором запускается событие
				 * @param {String} type - тип события
				 * @param {function} fn - функция - обработчик события
				 */
				add : function(el, type, fn) {
					el.attachEvent('on' + type, fn);
				},
				/**
				 * Удаление события
				 * 
				 * @memberOf evt
				 * @type {function}
				 * @param {Element} el - элемент, на котором запускается событие
				 * @param {String} type - тип события
				 * @param {function} fn - функция - обработчик события
				 */
				remove : function(el, type, fn) {
					el.detachEvent('on' + type, fn);
				}
			};
		}
	}());
	/** *************************************************************************************************************************** */
	/**
	 * В дизайне есть два окна - pop-up - для аутентификации на сайте и для
	 * выбора тегов при поиске по сайту. С помощью конструктора PopUp
	 * устанавливается простейшее поведение для этих окон.
	 * 
	 * @param {Object|String} wdw - само появляющееся окно,
	 * @param {Object|String} open - псевдоссылка, инициализирующая окно,
	 * @param {Object|String} close - кнопка, закрывающая окно
	 * @param {Function} callback - функция, вызываемая каждый раз при 
	 * 						открытии или закрытии всплывающего окна
	 * 
	 * @class
	 * @property {Element} popUp - элемент - "экземпляр" PopUp
	 * @property {String} id - идентификатор id элемента - "экземпляра" PopUp
	 */
	var PopUp = function(wdw, open, close, callback) {
		var that = this,
		/**
		 * элемент, инициализирующий окно
		 * @type {Element}
		 */
		start,
		/**
		 * элемент, закрывающий окно
		 * @type {Element}
		 */
		fine;

		if (typeof wdw === 'object') {
			this.id = wdw.id;
			this.popUp = wdw;
		} else if (typeof wdw === 'string') {
			this.id = wdw.replace(/(?:\W*)([\w-_]+)/, '$1');
			this.popUp = document.querySelector(wdw);
		};

		if (typeof open === 'object') {
			start = open;
		} else if (typeof open === 'string') {
			start = document.querySelector(open);
		};

		if (typeof close === 'object') {
			fine = close;
		} else if (typeof close === 'string') {
			fine = this.popUp.querySelector(close);
		};

		evt.add(start, 'click', function() {
					that.show.call(that, callback);
				});
		evt.add(fine, 'click', function() {
					that.hide.call(that, callback);
				});

	};
	/**
	 * объект data создан для возможности отслеживания статуса окон: открыты они
	 * или закрыты.
	 * @static
	 */
	PopUp.data = {};
	/**
	 * Метод "экземпляра" popUp, при вызове которого окно "открывается", в
	 * свойство конструктора data записывается статус окна (открыто).
	 * @param {Function} callback - функция, вызываемая каждый раз при 
	 * 						открытии или закрытии всплывающего окна
	 * @return {String} id - идентификатор окна, которое открылось
	 */
	PopUp.prototype.show = function(callback) {
		this.popUp.style.display = '';
		PopUp.data[this.id] = true;
		if (callback)
			callback();
		return this.id;
	};
	/**
	 * Метод "экземпляра" popUp, при вызове которого окно "закрывается", в
	 * свойство конструктора data записывается статус окна (закрыто).
	 * @param {Function} callback - функция, вызываемая каждый раз при 
	 * 						открытии или закрытии всплывающего окна
	 * @return {String} id - идентификатор окна, которое закрылось
	 */
	PopUp.prototype.hide = function(callback) {
		this.popUp.style.display = 'none';
		PopUp.data[this.id] = false;
		if (callback)
			callback();
		return this.id;
	};
	/** *************************************************************************************************************************** */
	/**
	 * auth - модуль инициирует работу всплывающего окна аутентификации, а также
	 * осуществляет проверку корректности заполнения полей аутентификации в
	 * форме
	 * @type {Object}
	 */
	var auth = (function() {
		/**
		 * Псевдоссылка "Войдите" в шапке страницы, при нажатии на которую
		 * открывается окно аутентификации
		 * @type {Element}
		 */
		var authOpen = document.querySelector("#auth-open"),
		/**
		 * Кнопка в виде крестика в правом верхнем углу окна аутентификации, при
		 * нажатии на которую окно закрывается
		 * @type {Element}
		 */
		authClose = document.querySelector("#auth-close"),
		/**
		 * Объект всплывающего окна аутентификации
		 * @type {Object}
		 */
		enter = new PopUp("#auth", authOpen, authClose);
		enter.hide();

		return enter;
	}());
	/** *************************************************************************************************************************** */
	/**
	 * tags - модуль выбора тегов для запроса на сервер
	 * 
	 * @type {Object}
	 * @return {Function} start - метод объекта, вызов которого инициирует
	 *         работу всех приватных функций объекта.
	 */
	var tags = (function() {

		/**
		 * Переменная будет хранить список тегов в форме поиска
		 * @type {HTMLUListElement()}
		 */
		var list,

		/**
		 * Определяет объект тега с его меткой, значением, отправляемым на
		 * сервер, и кнопкой сброса тега.
		 * @param {HTMLLIElement()}
		 *            item - элемент item списка тегов, имеет пользовательский
		 *            атрибут data-value, содержащий значение, которое будет
		 *            присвоено полю-checkbox, создаваемому в форме поиска
		 *            рецептов (с помощью тегов).
		 * @return {Object} data - содержит значение тега, метку, кнопку сброса
		 *         собственную и кнопку сброса элемента, его "породившего".
		 */
		getData = function(item) {
			/**
			 * Дочерние элементы: текстовое содержимое и span "reset'a" элемента
			 * item списка тегов.
			 * @type {Element[]}
			 */
			var children = item.childNodes,
			/**
			 * Объект объединяет значение тега, метку, кнопку сброса собственную
			 * и кнопку сброса элемента, его "породившего".
			 * @type {Object}
			 */
			data = {
				/** Значение тега, отправляемое на сервер */
				value : '',
				/** Текстовое отображение тега */
				label : '',
				/** Кнопкау сброса элемента */
				reset : {},
				/** Кнопка сброса элемента, породившего этот тег */
				parentReset : {}
			};
			/**
			 * Свойство html-элемента с пользовательскими атрибутами,
			 * начинающимися на data-
			 * @type {DOMStringMap}
			 */
			if (/* DOMStringMap */item.dataset) {
				for (var k in item.dataset) {
					if (k === 'value')
						data.value = item.dataset[k].replace(/^(\s)*/, '')
								.replace(/(\s)*$/, '');
				}
			} else {
				/**
				 * Если агент не поддерживает dataset, то перебираем все
				 * атрибуты до искомого
				 * @type {NamedNodeMap}
				 */
				var atts = item.attributes;
				for (var i = 0; i < atts.length; i++) {
					if (atts[i].name.indexOf('data-value') === 0) {
						data.value = atts[i].nodeValue.replace(/^(\s)*/, '')
								.replace(/(\s)*$/, '');
					}
				}
			}

			for (var i = 0; i < children.length; i++) {
				if (children[i].nodeType === 3) {
					data.label = children[i].nodeValue.replace(/^(\s)*/, '')
							.replace(/(\s)*$/, '');
				} else if (children[i].nodeType === 1
						&& children[i].nodeName.toLowerCase() === "span") {
					if (window.getComputedStyle
							&& getComputedStyle(children[i], null)['display'] == 'none'
							|| document.documentElement.currentStyle
							&& children[i].currentStyle['display'] == 'none') {
						children[i].style.display = 'inline';
					}
					data.reset = children[i].cloneNode(true);
					data.parentReset = children[i];
				}
			}
			return data;
		},
		/**
		 * Фильтруем элементы, получающие событие "click" в окне выбора тегов,
		 * до элемента списка тегов - item. Единственный выбранный элемент
		 * обрабатывается функцией обратного вызова - в данном случае:
		 * getData().
		 * 
		 * @param {Event} event
		 * @param {Function} callback - getData().
		 * @return {getData()} data - объект содержащий значение тега, метку,
		 *         кнопку сброса собственную и кнопку сброса элемента, его
		 *         "породившего".
		 */
		getItem = function(event, callback) {
			var e = event || window.event,
			/**
			 * Элемент item списка тегов, имеет пользовательский атрибут
			 * data-value, содержащий значение, которое будет присвоено
			 * полю-checkbox, создаваемому в форме поиска рецептов (с помощью
			 * тегов).
			 * @type {HTMLLIElement()}
			 */
			cnt = e.target || e.srcElement,
			/**
			 * Отобранному элементу будет присвоен новый класс, который в
			 * соответствии с правилами css изменит визуально редставление
			 * элемента на странице.
			 * @type {String}
			 */
			newClass = '_state_checked';
			if (cnt.nodeName.toLowerCase() !== "li")
				return;
			else {
				/* Если элемент уже выбран, игнорируем его */
				if (/ed$/.test(cnt.className))
					return;
				else {
					/**
					 * Формируем объект содержащий значение тега, метку, кнопку
					 * сброса собственную и кнопку сброса элемента, его
					 * "породившего", для дальнейшего использования.
					 * @type {getData()}
					 */
					var data = callback(cnt);
					cnt.className += newClass;
					return data;
				}
			}
		},
		/**
		 * Создает список выбранных checkbox в теле формы для дальнейшей
		 * отправки их на сервер.
		 * 
		 * @param {Function} Constr - с помощью функции-конструктора создаются объекты
		 *            		html- элементов LI, содержащих искомые checkbox.
		 * @param {getItem()} itemData - объект содержащий значение тега, метку, кнопку
		 *            		сброса собственную и кнопку сброса элемента, его "породившего".
		 * @param {HTMLUListElement()} listReqTags - список тегов в форме поиска
		 * @param {Function} callback - функция, вызываемая каждый раз при 
		 * 					закрытии элемента списка тегов
		 */
		createListReqTags = function(Constr, itemData, listReqTags, callback) {
			var itemReqTag = new Constr(itemData, callback);
			listReqTags.appendChild(itemReqTag);
		},

		/**
		 * Создает элемент списка тегов с дочерним checkbox в форме поиска.
		 * 
		 * @param {getItem()} data - объект содержащий значение тега, метку, кнопку
		 *            			сброса собственную и кнопку сброса элемента, его
		 *            			"породившего".
		 * @param {Function} callback - функция, вызываемая каждый раз при закрытии элемента списка тегов
		 * @return {HTMLitemElement()} при создании объекта с помощью
		 *         этой-функции - конструктора, он будет html-элементом item.
		 * @class
		 * @property {HTMLitemElement()} item - элемент списка
		 * @property {HTMLLabelElement()} label - метка поля checkbox
		 * @property {String} txt - текстовое содержимое метки
		 * @property {HTMitemnputElement()} box - поле checkbox
		 * @property {Object} closing - кнопка сброса собственная
		 * @property {Object} parentReset - кнопка сброса порождающего элемента.
		 */
		CreateItemReqTag = function(data, callback) {
			this.item = document.createElement("li");
			this.item.className = 'b-tags__item_state_checked';
			this.label = document.createElement("label");
			this.label.htmlFor = data.value;
			this.txt = document.createTextNode(data.label);
			this.label.appendChild(this.txt);
			this.box = document.createElement("input");
			this.box.type = 'checkbox';
			this.box.name = 'tag';
			this.box.value = data.value;
			this.box.id = data.value;
			this.box.style.position = 'absolute';
			this.box.style.visibility = 'hidden';
			this.box.checked = true;
			this.closing = data.reset;
			this.item.appendChild(this.label);
			this.item.appendChild(this.box);
			this.item.appendChild(this.closing);
			this.parentReset = data.parentReset;
			/**
			 * Локальная ссылка на пока фиктивный объект, который будет создан с
			 * помощью этой функции - конструктора.
			 * @type { new CreateItemReqTag()}
			 */
			var self = this;
			// устанавливается поведение: при клике на крестик закрытия 
			// элемента списка тегов во всплывающем окне или на крестик 
			// закрытия элемента списка тегов в форме поиска, элемент 
			// списка в форме поиска удаляется из DOM, а элемент списка 
			// во всплывающем окне меняет свое представление на неактивное
			evt.add(this.parentReset, 'click', function() {
													self.reset(callback);
												}
			);
			evt.add(this.closing, 'click', function(event) {
												var e = event || window.event, cnt = e.target || e.srcElement;
												if (cnt.nodeName.toLowerCase() === 'span')
													self.reset(callback);
												}
			);
			return this.item;
		};
		/**
		 * Mетод удаляет сам элемент с дочерним checkbox'ом из списка тегов
		 * формы поиска, а также преобразует вид родившего его элемента "в
		 * невыбранный".
		 * 
		 * @param {Function} callback - функция, вызываемая каждый раз при закрытии элемента списка тегов
		 * @public
		 */
		CreateItemReqTag.prototype.reset = function(callback) {
			if (this.box.checked === true)
				this.box.checked = false;
			this.item.parentNode.removeChild(this.item);
			this.parentReset.parentNode.className = this.parentReset.parentNode.className.replace(/(.+)(?:_s(.+)$)/, '$1');
			this.parentReset.style.display = 'none';

			// Удаляем установленный обработчик, т.к. элемент li, "породивший"
			// объект тега продолжит существовать и не должен накапливать события
			// устанавливаемые каждый раз при инициации объекта с помощью
			// функции-конструктора
			evt.remove(this.parentReset, "click", function() {
													this.reset();
												}
			);
			if (callback)
				callback();
		};

		/**
		 * Cоздает список выбранных тегов, вставляет в форму поиска и заполняет
		 * по мере выбора новых тегов. Устанавливает на сам список отслеживание
		 * события его опустошения, чтобы убрать его отображение со страницы
		 * 
		 * @param {Event} e - объект события для отслеживания элемента, породившего
		 *            	это событие (элемент списка тегов всплывающего окна выбора
		 *            	тегов), передается аргументом во вложенную функцию
		 * @param {HTMLFormElement()} form - форма поиска, куда будет вставлен список выбранных
		 *            	тегов (checkbox).
		 * @param {Function} callback - функция, вызываемая каждый раз при закрытии элемента списка 
		 * 				тегов, передается аргументом во вложенную функцию
		 */
		var chooseTag = function( /* Event */e, form, callback) {
			/**
			 * Определили элемент события и взяли его данные
			 * 
			 * @type {getItem()} data - объект содержащий значение тега, метку,
			 *       кнопку сброса собственную и кнопку сброса элемента, его
			 *       "породившего".
			 */
			var data = getItem(e, getData);

			if (data) {
				if (typeof list === "undefined") {
					list = document.createElement('ul');
					list.className = "b-tags__list b-search__list";
					list.style.marginTop = '2px';
					list.style.marginLeft = '40px';
					createListReqTags(CreateItemReqTag, data, list, callback);
					form.appendChild(list);
				} else {
					createListReqTags(CreateItemReqTag, data, list, callback);
				}

			}
		},
		/**
		 * Получение всех требуемых элементов страницы, создание всплывающего
		 * окна выбора тегов и установка обработчиков событий.
		 * 
		 * @return {Function} новая функция содержит все инструкции по установке
		 *         обработчиков событий требуемым элементам, которые
		 *         инкапсулированы в теле старой функции.
		 */
		init = (function() {
			/**
			 * Форма поиска рецептов с помощью запроса в поле ввода и выбора
			 * тегов.
			 * 
			 * @type {HTMLFormElement()}
			 */
			var form = document['search'],
			/**
			 * Поле ввода для строки запроса в форме поиска рецептов
			 * 
			 * @type {Element}
			 */
			input = form.elements['search_string'],
			/**
			 * Обертка для поля submit в форме поиска рецептов
			 * 
			 * @type {Element}
			 */
			submit = document.querySelectorAll('.b-form_state_toggle__submit')[0],
			/**
			 * Псевдоссылка "Добавить тэг" для открытия всплывающего окна выбра
			 * тегов
			 * 
			 * @type {Element}
			 */
			openTagsWdw = document.querySelector('#tags-open'),
			/**
			 * Текстовое содержимое псевдоссылки "Добавить тэг"
			 * 
			 * @type {String}
			 */
			txt = openTagsWdw.children[0].innerHTML,
			/**
			 * Блок, содержащий имеющиеся теги, представляется в виде
			 * всплывающего окна
			 * 
			 * @type {Element}
			 */
			tagsWdw = document.querySelector('#tags'),
			/**
			 * Вложенный в блок список тегов
			 * 
			 * @type {Element}
			 */
			tagsList = tagsWdw.querySelector('.b-tags__list'),
			/**
			 * Кнопка закрытия pop-up окна выбора тегов
			 * 
			 * @type {Element}
			 */
			closeTagsWdw = tagsWdw.querySelector('#tags-close'),
			/**
			 * Отображение (сброс) готовности формы к поиску.
			 * @type {Function}
			 * @description Эта функция будет вызываться каждый раз при 
			 * событиях вызова всплывающего окна выбора тегов, создании 
			 * списка выбранных тегов в форме поиска или удалении этого 
			 * списка, чтобы корректировать представление формы поиска:
			 * разворачивание(сворачивание) поля ввода запроса по ширине до
			 * логотипа (до ширины, определенной изначально в css), появление
			 * (исчезновение кнопки подтверждения запроса), корректировка
			 * положения списка тегов в форме поиска.
			 */
			setView = function() {
				if (PopUp.data[popUpId] && PopUp.data[popUpId] === true) {
					openTagsWdw.children[0].innerHTML = 'теги:';
					submit.style.display = 'inline-block';
					input.style.width = '600px';
					if (typeof list === 'object') {
						list.style.marginTop = '2px';
						list.style.marginLeft = '40px';
					}
				} else if (PopUp.data[popUpId] === false
						&& (typeof list === 'undefined' || list.hasChildNodes() === false)) {
					openTagsWdw.children[0].innerHTML = txt;
					submit.style.display = '';
					input.style.width = '';
					if (typeof list === 'object') {
						list.style.margin = '0px';
					}
				}
			},
			/**
			 * Экземпляр PopUp - всплывающее окно выбора тегов
			 * @type {Object}
			 */
			tagsPopUp = new PopUp(tagsWdw, openTagsWdw, closeTagsWdw, setView),
			/**
			 * Идентификатор состояния окна (открыто - true, закрыто - false)
			 * Глобальная переменная - свойство window
			 * @type {Boolean}
			 */
			popUpId = tagsPopUp.hide();

			return function() {
				evt.add(tagsList, 'click', function(/* Event */e) {
												chooseTag(e, form, setView);
											}
				);
			};

		}());

		return {
			/**
			 * метод объекта, вызов которого инициирует работу всех приватных
			 * функций объекта.
			 * 
			 * @type {Function}
			 */
			start : init
		};
	}());
	/** *************************************************************************************************************************** */
	/**
	 * Слайдшоу "рецепты дня"
	 * 
	 * @author <a href="http://elkonina.ru">Konina Yelena</a>
	 * @namespace объединяет все инициированные переменные и методы для показа
	 *            слайдшоу
	 * @type slideshow
	 * @return { { present: function, refresh: function} } объект, содержащий
	 *         два метода: present - инициирует работу слайдшоу и загружает
	 *         начальное представление на текущий день, refresh - обновляет
	 *         представление в соответстии с требуемым днем (сегодня, вчера,
	 *         завтра).
	 */
	var slideshow = (function() {

		/**
		 * Объект содержит строковые значения дат "сегодня", "вчера",
		 * "позавчера", сгенерированных автоматически.
		 * 
		 * @fieldOf slideshow
		 * @type {Object}
		 * @private
		 */
		var date = (function() {
				/**
				 * Обрабатывает значение даты, сгенерированное автоматически, 
				 * для представления по маске YYYY-MM-DD, требуемой для корректного 
				 * запроса на сервере к базе данных
				 * @type {Function}
				 * @param {Object} day - дата запрашиваемого дня
				 */
			var getCntDate = function (day) {
				return day.getFullYear()+ '-'+ (day.getMonth().toString().length === 1 ? '0'+ (day.getMonth() + 1) : (day.getMonth() + 1))+ '-'+ (day.getDate().toString().length === 1 ? '0'+ day.getDate() : day.getDate());
			},
				/**
				 * Текущий день
				 * 
				 * @type {Date()}
				 */
				cntDay = new Date(), 
				/**
				 * Сегодня
				 * @type {String}
				 */
				toDay = getCntDate(cntDay);
			// переустановили дату на вчера	
			cntDay.setDate(cntDay.getDate() - 1);
				/**
				 * Вчера
				 * @type {String}
				 */				
			var oneDayAgo = getCntDate(cntDay);
			
			// переустановили дату на позавчера	
			cntDay.setDate(cntDay.getDate() - 1);
				/**
				 * Позавчера
				 * @type {String}
				 */
			var twoDayAgo = getCntDate(cntDay);
			// в целях презентации работы  в статусе макета (без ежедневного 
			// обновления базы данных) дни запросов заданы строковыми 
			// значениями, соответствующими установленным в базе данных
			return {
				/**
				 * Содержит значение даты текущего дня по маске YYYY-MM-DD,
				 * требуемой для корректного запроса на сервере к базе данных
				 * 
				 * @public
				 * @type {String}
				 */
				//toDayQuery : toDay,
				toDayQuery : "2012-09-07",				
				/**
				 * Содержит значение даты вчерашнего дня по маске YYYY-MM-DD,
				 * требуемой для корректного запроса на сервере к базе данных
				 * 
				 * @public
				 * @type {String}
				 */
				//oneDayAgoQuery : oneDayAgo,
				oneDayAgoQuery : "2012-09-06",
				/**
				 * Содержит значение даты позавчерашнего дня по маске
				 * YYYY-MM-DD, требуемой для корректного запроса на сервере к
				 * базе данных
				 * 
				 * @public
				 * @type {String}
				 */
				//twoDayAgoQuery : twoDayAgo
				twoDayAgoQuery : "2012-09-05"
			};
		}()),
		/**
		 * Cписок всех рецептов дня слайдшоу, в котором они располагаются в одну
		 * линию без переноса.
		 * 
		 * @type {HTMLUListElement()}
		 */
		gallery = document.querySelector(".b-recipe__content-list"),
		/**
		 * Список дат, когда были опубликованы новые рецепты, представленные в
		 * слайдшоу
		 * 
		 * @type {HTMLUListElement()}
		 */
		dateList = document.querySelector('.b-recipe__date-list'),
		/**
		 * Создает объект рецепта, который представляет собой элемент LI с
		 * дочерними: >figure>img+figcaption>(h2>a)+p, все классы описаны в css
		 * 
		 * @constructor
		 * @param {String}
		 *            title - заголовок подписи к изображению рецепта
		 * @param {String}
		 *            page - ссылка на страницу подробного представления рецепта
		 * @param {String}
		 *            txt - текст подписи к изображению рецепта
		 * @param {String}
		 *            img - изображение рецепта
		 * @return {HTMLLIElement()} item - элемент списка с изображением
		 *         рецепта и текстом- подписью
		 */
		CreateRecipe = function(title, page, txt, img) {
			/**
			 * Создает html-элемент и устанавливает свойство, ссылающееся на
			 * атрибут class элемента.
			 * 
			 * @type {function}
			 * @param {String}
			 *            el - имя узла (nodeName)
			 * @param {String}
			 *            _class - значение класса элемента
			 * @return {Element} htmlEl - узел DOM
			 */
			var makeEl = function(el, _class) {
				/**
				 * Инициируемый html-элемент, возвращаемый в результате работы
				 * функции
				 * 
				 * @type {Element}
				 */
				var htmlEl = document.createElement(el);
				if (_class)
					htmlEl.className = _class;
				return htmlEl;
			}, head = makeEl('h2'), link = makeEl('a', 'b-recipe__caption-head'), text = makeEl(
					'p', 'b-recipe__caption-text'), image = makeEl('img'), caption = makeEl(
					'figcaption', 'b-recipe__caption'), figure = makeEl(
					'figure', 'b-recipe__image'), item = makeEl('li',
					'b-recipe__content-item');

			link.innerHTML = title;
			link.href = '#' + page;
			text.innerHTML = txt;
			image.src = 'i/b-recipe/' + img;
			image.alt = title;
			image.width = 699;
			image.height = 426;

			head.appendChild(link);
			caption.appendChild(head);
			caption.appendChild(text);
			figure.appendChild(image);
			figure.appendChild(caption);
			item.appendChild(figure);
			return item;
		},
		/**
		 * Функция возвращает объект с двумя методами: установка обработки
		 * события нажатия кнопок слайдшоу "вправо" и "влево" и удаление её.
		 * Вызов функции должен состояться только после завершения модификации
		 * узла списка рецептов.
		 * 
		 * @function
		 * @return { {yes: function, no: function} } делает кнопки слушателями
		 *         их нажатия
		 */
		letTurn = function() {
			/**
			 * Слушатель события запуска слайдшоу - элемент UL, содержащий "<"
			 * и ">" ("кнопки" влево и вправо)
			 * 
			 * @type {Element}
			 */
			var btns = document.querySelector('.b-recipe__btns'),
			/**
			 * "кнопка" "влево"
			 * 
			 * @type {Element}
			 */
			prev = btns.children[0],
			/**
			 * "кнопка" "вправо"
			 * 
			 * @type {Element}
			 */
			next = prev.nextSibling,
			/**
			 * Ширина элемента - списка рецептов, наследуемая всеми элементами
			 * списка.
			 * 
			 * @type {Number}
			 */
			dist = 0,
			/**
			 * Позиция списка рецептов относительно родительского элемента -
			 * div.b-recipe, который будет ограничивать ширину отображения
			 * списка на странице.
			 * 
			 * @type {Number}
			 */
			pos = 0,
			/**
			 * Общая ширина всех элементов списка рецептов.
			 * 
			 * @type {Number}
			 */
			maxDist = 0,
			/**
			 * Функция обрабатывает событие нажатия "кнопок" влево и вправо,
			 * перемещая соответственно слайды.
			 * 
			 * @type {function}
			 */
			letTurnHandle = function(/* Event */event) {
				var e = event || window.event,
				/**
				 * Элемент на котором событие fired
				 * 
				 * @type {Element}
				 */
				cnt = e.target || e.srcElement,
				/**
				 * Локальная переменная - ссылка на глобальный loadingScriptOut
				 *  @type { {init:function, jQ: String} }
				 */
				load = loadingScriptOut;
				if (window.getComputedStyle) {
					dist = parseInt(getComputedStyle(gallery, null).width, 10);
					pos = parseInt(getComputedStyle(gallery, null).left, 10);
				} else if (document.documentElement.currentStyle) {
					dist = parseInt(document.querySelector(".b-recipe").currentStyle.width,	10);// иначе IE8 видит ширину = auto
					pos = parseInt(gallery.currentStyle.left, 10);
				}
				maxDist = (gallery.children.length - 1) * dist;
				if (pos % dist != 0)
					return;
				// for agents supported Transition
				if (document.documentElement.className.indexOf('no-csstransitions') === -1) {
						
						if (/** Event.target */	cnt == prev) {
							gallery.style.left = ((pos + dist) > 0 ? -maxDist : (pos + dist)) + 'px';
						} else if (/** Event.target */ cnt == next) {
							gallery.style.left = ((-pos < maxDist) ? (pos - dist) : 0) + 'px';
						}
					} else {					
					//for agents don't supported Transition
						var withSupport$ = function () {
							if ($ && typeof $ === 'function') {
								if (/** Event.target */	cnt == prev) {
									$(gallery).animate({'left' : ((pos + dist) > 0 ? -maxDist : (pos + dist)) + 'px'}, 2000);
								} else if (/** Event.target */ cnt == next) {
									$(gallery).animate({'left': ((-pos < maxDist) ? (pos - dist) : 0) + 'px'}, 2000);
								}
							}	
						};
						if (typeof $ ==='undefined') {
							load.init(load.jQ, withSupport$, document.body);
						} else if ($ && typeof $ === 'function') {
							withSupport$();
						}		
					}
			};
			return {
				/**
				 * Устанавливает обработку события нажатия на кнопки управления
				 * 
				 * @type {function}
				 * @memberOf letTurn
				 */
				yes : function() {
					evt.add(btns, 'click', letTurnHandle);
				},
				/**
				 * Удаляет обработку события нажатия на кнопки управления
				 * 
				 * @type {function}
				 * @memberOf letTurn
				 */
				no : function() {
					evt.remove(btns, 'click', letTurnHandle);
				}
			};
		},
		/**
		 * Функция обрабатывает ответ сервера - строку, преобразует её в массив
		 * объектов, где ключи - названия столбцов базы данных, значения -
		 * содержимое этих столбцов. Количество этих объектов соответствует
		 * содержимому базы данных по выборке запрашиваемой даты (сегодня,
		 * вчера, позавчера).
		 * 
		 * @param {String}
		 *            txt - ответ сервера, содержащий данные рецептов на
		 *            запрашиваемую дату
		 */
		showSlide = function(txt) {
			/**
			 * Массив объектов, где ключи - названия столбцов базы данных,
			 * значения - содержимое этих столбцов.
			 * 
			 * @type {Object[]}
			 * @description объект массива temp[i] имеет ключи: head, page,
			 *              text, img
			 */
			var temp = JSON.parse(decodeURIComponent(txt).replace(/\+/g, ' ')), fragment = document
					.createDocumentFragment();
			if (Object.prototype.toString.call(temp) === '[object Array]') {
				/**
				 * Длина массива объектов с данными рецептов
				 * 
				 * @type{Number}
				 */
				var len = temp.length;
				while (len--) {
					/**
					 * Элемент списка с изображением рецепта и текстом -
					 * подписью
					 * 
					 * @type {CreateRecipe()}
					 */
					var listItem = CreateRecipe(temp[len].head, temp[len].page,
							temp[len].text, temp[len].img);
					fragment.appendChild(listItem);
				}
			}
			if (gallery.hasChildNodes()) {
				letTurn().no();
				var children = gallery.childNodes.length;
				while (children--) {
					gallery.removeChild(gallery.childNodes[children]);
				}
				gallery.appendChild(fragment);
			} else {
				gallery.appendChild(fragment);
			}
			letTurn().yes();
		},
		/**
		 * Типовая функция обращения к серверу GET-методом
		 * 
		 * @param {function}
		 *            callback - функция, обрабатывающая ответ с сервера
		 * @param {String}
		 *            query - строка запроса
		 */
		getRecipeFromServer = function(callback, query) {
			var request = new XMLHttpRequest(),
			/**
			 * адрес сервера вместе со строкой запроса
			 * 
			 * @type {String}
			 */
			urlWithQuery = 'get_recipe_from_base.php?date=' + query;

			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {
					callback(request.responseText);
				}
			};
			request.open("GET", urlWithQuery);
			request.send(null);
		},
		/**
		 * Типовая функция каррирования создает замыкание, которое хранит
		 * первоначальную функцию и аргументы.
		 * 
		 * @author Stoyan Stefanov from book - JavaScript Patterns, Copyright ©
		 *         2010 Yahoo!, Inc..
		 * @param {function}
		 *            fn - первоначальная функция в замыкании
		 * @return {function} новая функция, вызов которой возвращает работу
		 *         первоначальной функции с новыми аргументами.
		 */
		curry = function(fn) {
			var slice = Array.prototype.slice, args = slice.call(arguments, 1);
			return function() {
				return fn.apply(null, args.concat(slice.apply(arguments)));
			};
		},
		/**
		 * Функция обрабатывает нажатие кнопок "сегодня-вчера-завтра": меняет
		 * визуальное представление кнопок по нажатию, а также запускает событие
		 * обновления содержимого слайшоу.
		 * 
		 * @type {function}
		 */
		handleOfClick = function(/* Event */event) {
			var e = event || window.event,
			/**
			 * Элемент на котором событие fired
			 * 
			 * @type {Element}
			 */
			cnt = e.target || e.srcElement,
			/**
			 * В зависимости от кнопки (сегодня, вчера, позавчера), которую
			 * нажали, получаем из базы данные на тот денью
			 * 
			 * @param {String}
			 *            day - строковое значение текстового содержимого кнопок
			 *            "сегодня, вчера, позавчера".
			 * @type {function}
			 */
			defineBranch = function(day) {
				switch (day) {
					case 'сегодня' :
						curry(getRecipeFromServer, showSlide)(date.toDayQuery);
						break;
					case 'вчера' :
						curry(getRecipeFromServer, showSlide)(date.oneDayAgoQuery);
						break;
					case 'позавчера' :
						curry(getRecipeFromServer, showSlide)(date.twoDayAgoQuery);
						break;

					default :
						break;
				}
			},
			/**
			 * Строковое значение текстового содержимого кнопки (сегодня, вчера,
			 * позавчера).
			 * 
			 * @type {String}
			 */
			value = '';
			for (var i = 0; i < dateList.childNodes.length; i++) {
				var child = dateList.childNodes[i];
				if (child.className.indexOf('state') !== -1) {
					child.className = child.className.replace(
							/(^\s*.+\s*)(?:\s.+state.+\s*)(\s.)*$/g, '$1$2');
				}
			}
			if (cnt.nodeType === 1 && cnt.nodeName.toLowerCase() === 'span') {
				value = cnt.firstChild.nodeValue.toLowerCase();
				cnt.parentNode.className = cnt.parentNode.className.replace(
						/(.*\s)*([^^\s*].+)/, '$1$2 $2_state_current');
			} else if (cnt.nodeType === 1
					&& cnt.nodeName.toLowerCase() === 'li') {
				value = cnt.firstChild.firstChild.nodeValue.toLowerCase();
				cnt.className = cnt.className.replace(/(.*\s)*([^^\s*].+)/,
						'$1$2 $2_state_current');
			}
			defineBranch(value);
		},
		/**
		 * Функция устанавливает обработку события нажатия кнопок, дочерних
		 * .b-recipe__date-list
		 */
		setHandleOnList = function() {
			evt.add(dateList, 'click', function(/* Event */event) {
						handleOfClick(event);
					});
		};

		return {
			/**
			 * Инициирует работу слайдшоу и загружает начальное представление на
			 * текущий день
			 * 
			 * @memberOf slideshow
			 * @type {function}
			 */
			present : function() {
				curry(getRecipeFromServer, showSlide)(date.toDayQuery);
			},
			/**
			 * Обновляет представление в соответстии с требуемым днем (сегодня,
			 * вчера, позавчера).
			 * 
			 * @memberOf slideshow
			 * @type {function}
			 */
			refresh : setHandleOnList
		};
	}());
	/** *************************************************************************************************************************** */
	/**
	 * cookAdvices - модуль запрашивает XHR совет и выводит его на страницу. Фон
	 * совета выполнен на холсте, который перерисовывается в зависимости от
	 * высоты контента.
	 * 
	 * @author <a href="http://elkonina.ru">Konina Yelena</a>
	 * @type {Object}
	 */
	var cookAdvices = (function() {
		/**
		 * Объект объединяет в себе методы инициализации холста на странице,
		 * рисования фигуры фона и перерисовки его.
		 * 
		 * @type {Object.<string, function>}
		 */
		var drawCanvas = (function() {
			return {
				/**
				 * Определяет характеристики холста, загружает изображение,
				 * которое станет фоном фигуры на холсте.
				 * 
				 * @type {Function}
				 * @return {Object} объект с характеристиками холста и фигур на
				 *         нем.
				 */
				init : function() {
					/**
					 * Canvas-элемент на странице.
					 * 
					 * @type {HTMLCanvasElement()}
					 */
					var canvas = document.querySelector(".b-advice__bg"),
					/**
					 * Изображение, которое будет фоном фигуры, рисуемой на
					 * холсте
					 * 
					 * @type {HTMLImageElement()}
					 */
					img = new Image();

					canvas._height = (parseInt(getComputedStyle(
									canvas.parentNode, null).height, 10) + 40);
					img.src = 'i/b-advice/b-advice__bg.jpg';

					return {
						/**
						 * контекст HTMLCanvasElement
						 * 
						 * @type {CanvasRenderingContext2D()}
						 */
						ctx : canvas.getContext('2d'),
						/** константa скругления углов фигур */
						a : 15.0,
						/** константa скругления углов фигур */
						b : 7.5,
						/** ширина холста */
						A : canvas.width,
						/** высота холста */
						B : canvas._height,
						/** фон фигуры на холсте */
						img : img
					};
				},
				/**
				 * Непосредственно рисует на холсте фигуру в соответствии с
				 * данными, полученными из cvsObj, переданного функции
				 * аргументом.
				 * 
				 * @param {Object}
				 *            cvs - содержит характеристики холста и фигур на
				 *            нем для последующей перерисовки холста, если
				 *            контента будет больше
				 */
				draw : function(/** drawCanvas.init() */
						cvs) {
					var ctx = cvs.ctx, a = cvs.a, b = cvs.b, A = cvs.A, B = cvs.B, img = cvs.img;
					// advicebg/bg
					ctx.save();
					ctx.beginPath();
					ctx.moveTo(A, (B - a));
					ctx.bezierCurveTo((A - b), (B - a), (A - a), (B - b),
							(A - a), B);
					ctx.lineTo(a, B);
					ctx.bezierCurveTo(a, (B - b), a, (B - a), 0.0, (B - a));
					ctx.lineTo(0.0, a);
					ctx.bezierCurveTo(b, a, a, b, a, 0.0);
					ctx.lineTo((A - a), 0.0);
					ctx.bezierCurveTo((A - a), b, (A - b), a, A, a);
					ctx.lineTo(A, (B - a));
					ctx.closePath();
					var ptn = ctx.createPattern(img, 'repeat');
					ctx.fillStyle = ptn;
					ctx.fill();
					// advicebg/stroke
					var c = a * 2 / 3, d = b * 2 / 3, C = (A - c), D = (B - c);
					ctx.beginPath();
					ctx.moveTo(C, (D - c));
					ctx.bezierCurveTo((C - d), (D - c), (C - c), (D - d),
							(C - c), D);
					ctx.lineTo((c + c), D);
					ctx.bezierCurveTo((c + c), (D - d), (c + d), (D - c), c,
							(D - c));
					ctx.lineTo(c, (c + c));
					ctx.bezierCurveTo((c + d), (c + c), (c + c), (c + d),
							(c + c), c);
					ctx.lineTo((C - c), c);
					ctx.bezierCurveTo((C - c), (c + d), (C - d), (c + c), C,
							(c + c));
					ctx.lineTo(C, (D - c));
					ctx.closePath();
					ctx.strokeStyle = "rgb(255, 255, 255)";
					ctx.lineJoin = "miter";
					ctx.miterLimit = 5.0;
					ctx.stroke();
					ctx.restore();
				},
				/**
				 * Перерисовывает холст, чтобы контент не выходил за границы.
				 * 
				 * @param {Object}
				 *            cvs - содержит характеристики холста и фигур на
				 *            нем
				 * @param {Number}
				 *            h - высота html-элемента
				 *            <p> - параграфа, содержащего текст совета
				 */
				reDraw : function(/** drawCanvas.init() */
						cvs, h) {
					cvs.ctx.clearRect(0, 0, cvs.A, cvs.B);
					cvs.B = h;
					this.draw(cvs);
				}
			};
		}()),
		/**
		 * Объект объединяет в себе методы запроса на сервер, определение
		 * количества советов на сервере, отображения совета на странице
		 * 
		 * @type {Object.<string, function>}
		 */
		getAdviceXHR = (function() {
			/**
			 * отслеживает тип контента для верного его предстваления
			 * 
			 * @param {NodeHttpModule}
			 *            request - объект запроса на сервер
			 * @return {(XMLElement|Object|String)}
			 */
			var getResponse = function(request) {
				switch (request.getResponseHeader("Content-Type")) {
					case "text/xml" :
						return request.responseXML;
					case "text/json" :
					case "application/json" :
					case "text/javascript" :
					case "application/javascript" :
					case "application/x-javascript" :
						return eval(request.responseText);
					default :
						return request.responseText;
				}
			},
			/**
			 * getAmountAdvs - реализует HEAD-метод обращения на сервер за
			 * пользовательским заголовком Count-content, чтобы выяснить
			 * количество советов в текстовом файле.
			 * 
			 * @param {String}
			 *            url - адрес сервера
			 * @param {Function}
			 *            callback - функция обратного вызова, обрабатывающая
			 *            ответ с сервера
			 */
			getAmountAdvs = function(url, callback) {
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if (request.readyState == 4 && request.status == 200) {
						callback(request.getResponseHeader("Count-content"));
					}
				};
				request.open("HEAD", url);
				request.send(null);
			},

			/**
			 * getAdv - реализует GET-метод обращения на сервер, чтобы получить
			 * очередной совет
			 * 
			 * @param {String}
			 *            url - адрес сервера
			 * @param {Function}
			 *            callback - функция обратного вызова, обрабатывающая
			 *            ответ с сервера
			 */
			getAdv = function(url, callback) {
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if (request.readyState == 4 && request.status == 200) {
						callback(getResponse(request));
					}
				};
				request.open("GET", url);
				request.send(null);
			},
			/**
			 * num - самоопределяемая функция инкапсулирует в своем теле счетчик
			 * советов для последовательной их выдачи по порядку. Номер первого
			 * совета получается случайным образом.
			 * 
			 * @return {Function} возвращаемая функция, которая будет наращивать
			 *         счетчик советов при каждом обращении к ней.
			 */
			num = (function() {
				/**
				 * Количество советов на сервере
				 * 
				 * @type {Number}
				 */
				var max,
				/**
				 * Счетчик, инкапсулируемый в теле начальной функции. Начальное
				 * значение первого совета с сервера получается случайным
				 * образом.
				 * 
				 * @type {Number}
				 */
				count = Math.round(Math.random() * 10);

				getAmountAdvs("get_advice_txt.php",
						/**
						 * обрабатывает ответ сервера
						 * 
						 * @param {Number}
						 *            n - число, содержащееся в заголовке
						 *            Content-Count, означает количество советов
						 *            в текстовом файле.
						 */
						function(n) {
					max = parseInt(n, 10);
				});
				return function() {
					if (count < (max - 1))
						count += 1;
					else
						count = 0;
					return count;
				};
			}()),
			/**
			 * Объект сохраняет характеристики холста и фигур на нем для
			 * последующей перерисовки холста, если контента будет больше.
			 * 
			 * @type {Object}
			 */
			cvs = {},
			/**
			 * showResult - получает текстовый ответ и выводит его на страницу.
			 * Для агентов, поддерживающих canvas, фон совета выполнен на холсте
			 * и при каждом изменении высоты контента холст перерисовывается
			 * 
			 * @param {String}
			 *            response - текст совета, получаемого с сервера.
			 */
			show = function(response) {
				/**
				 * Параграф, содержащий текст совета.
				 * 
				 * @type {Element}
				 */
				var txt = document.querySelector('.b-advice__text');

				txt.innerHTML = response;
				if (/no-canvas/.test(document.documentElement.className))
					return;
				/**
				 * Высота html-элемента
				 * <p> - параграфа, содержащего текст совета
				 * 
				 * @type {Number}
				 */
				var txtHeight = parseInt(getComputedStyle(txt, null).height, 10)
						+ 40;

				drawCanvas.reDraw.call(drawCanvas, /** drawCanvas.init() */
						cvs, txtHeight);
			};

			return {
				/**
				 * Метод объекта getAdviceXHR, инициализирующий обработку
				 * события получения нового совета и отображения его на
				 * отрисованном холсте.
				 * 
				 * @type {Function}
				 */
				start : function() {
					/**
					 * Ссылка, при нажатии которой отображается новый совет.
					 * 
					 * @type {Element}
					 */
					var start = document.querySelector('.b-advice__link');

					evt.add(start, 'click', function() {
								/**
								 * Адрес запроса на сервер вместе со строкой
								 * запроса, вызов метода num - дает номер
								 * запрашиваемого совета.
								 * 
								 * @type {String}
								 */
								var url = "get_advice_txt.php?num=" + num();

								getAdv(url, show);
							});
					if (/no-canvas/.test(document.documentElement.className))
						return;
					cvs = drawCanvas.init();
					cvs.img.onload = function() {
						return drawCanvas.draw(cvs);
					};
				}
			}
		}());
		return {
			/**
			 * Метод объекта cookAdvices, инициализирующий обработку события
			 * получения нового совета и отображения его на отрисованном холсте.
			 * 
			 * @type {Function}
			 */
			init : getAdviceXHR.start
		};
	}());

	return {
		/**
		 * При загрузке страницы: 1) инициализируется поведение pop-up окон
		 * аутентификации и выбора тегов; 2) уставливается объект управления для
		 * загрузки нового совета с сервера; 3) для него устанавливается
		 * событие: по щелчку получает ответ сервера - новый совет; 4)
		 * определяется canvas и фон для него; 5) по окончании загрузки
		 * изображения - фона фигуры, строится сама фигура на холсте;
		 */
		init : function() {
			tags.start();
			slideshow.present();
			slideshow.refresh();
			cookAdvices.init.call(cookAdvices);
		}
	};
}());
window.onload = function() {
	malahova.init();
};
