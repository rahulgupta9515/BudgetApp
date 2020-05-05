
// var budegtController = (function(){

//     var x = 23;
//     var add = function(a){
//         return x+a;
//     }

//     return{
//         publicTest: function(b){
//             return add(b);
//         }
//     }
// })();

//BUDGET CONTROLLER
var budegtController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function(totalincome){
        if(totalincome>0){
            this.percentage = Math.round(((this.value)/(totalincome))*100);
        }else{
            this.percentage = -1;
        }  
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });

        data.total[type] = sum;
    };

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        total:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return{
        addItem: function(type, desc, value){
            var newItem, ID ;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            }else{
                ID = 0;
            }

            if(type === 'exp'){
                newItem = new Expense(ID, desc, value);
            }else if(type === 'inc'){
                newItem = new Income(ID, desc, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;
            ids = data.allItems[type].map(function(curr){
                return curr.id;
            });

            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.total.inc - data.total.exp;
            if(data.total.inc > 0){
                data.percentage = Math.round((data.total.exp) /(data.total.inc)*100);
            }else{
                data.percentage = -1;
            }
           
        },

        calculatePercentage: function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.total.inc);
            });
        },

        getPercentages: function(){
            var allperc = data.allItems.exp.map(function(curr){
                return curr.getPercentage()
            });
            return allperc;
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },

        test: function(){
            console.log(data);
        }
    };


})();


//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        input_type: '.add__type',
        input_desc: '.add__description',
        input_value: '.add__value',
        input_btn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLable: '.budget__income--value',
        expenseLable: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        ExpensePerLabel:'.item__percentage', 
        datelabel: '.budget__title--month'
    }

    var fromatNumber =  function(num, type){
        var numSplitm, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit  = num.split('.');
        int = numSplit[0];
        if(int.length > 3){
            int  = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, 3);
        }
        dec = numSplit[1];

        return (type === 'exp'? '-' : '+') + ' ' + int + '.' +  dec;
    }

    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };


    return{
        getInput: function(){
            return{
                type : document.querySelector(DOMStrings.input_type).value,
                description : document.querySelector(DOMStrings.input_desc).value,
                value : parseFloat(document.querySelector(DOMStrings.input_value).value)
            }; 
        },

        addListItem: function(obj, type){
            var html, newHTML, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><divclass="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', fromatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML); 
        },

        deleteistItem: function(selectorID){
            var el =  document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMStrings.input_desc + ',' + DOMStrings.input_value);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });
            fieldsArray[0].focus();
        },

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = fromatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLable).textContent = fromatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLable).textContent = fromatNumber(obj.totalExp, 'exp');
           

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercenatges: function(percentages){
            var fields;
            fields = document.querySelectorAll(DOMStrings.ExpensePerLabel);
             
            nodeListForEach(fields, function(curr, index){
                if(percentages[index] > 0){
                    curr.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function(){
            var now, year, month
            now = new Date();
            year = now.getFullYear();
            month = now.getUTCMonth();
            console.log(month);
            document.querySelector(DOMStrings.datelabel).textContent = 'May' + ' ' +year;
        },

        changeType: function(){
            var fields = document.querySelectorAll(DOMStrings.input_type + ',' + DOMStrings.input_desc + ','+ DOMStrings.input_value);
            nodeListForEach(fields, function(curr){
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.input_btn).classList.toggle('red');
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    };
    
})();


//Global CONTROLLER
var constroller = (function(budgetctrl, uictrl){

    var setupEventListeners = function(){
        var DOM = uictrl.getDOMStrings();
        document.querySelector(DOM.input_btn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
             if(event.keyCode === 13 || event.which === 13){
                 ctrlAddItem();
             }
         });

         document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

         document.querySelector(DOM.input_type).addEventListener('change', uictrl.changeType)

    };

    var updateBudget = function(){
        budgetctrl.calculateBudget();
        var budget = budgetctrl.getBudget();
        uictrl.displayBudget(budget);
    }

    var upadtePrecenatge = function(){
        budgetctrl.calculatePercentage();
        var percentage = budgetctrl.getPercentages();
       uictrl.displayPercenatges(percentage);
    }

    var ctrlAddItem = function(){
        var input, newItem;

        input = uictrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value>0){
            newItem = budgetctrl.addItem(input.type, input.description, input.value);
            uictrl.addListItem(newItem, input.type);
            uictrl.clearFields();
            updateBudget();
            upadtePrecenatge();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetctrl.deleteItem(type, ID);
            uictrl.deleteistItem(itemID);
            updateBudget();
            upadtePrecenatge();
        }
    };

    return{
        init: function(){
            setupEventListeners();
            uictrl.displayMonth();
            uictrl.displayBudget( 
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: 0
                }
            );
        }
    };

  
})(budegtController, UIController);


constroller.init();