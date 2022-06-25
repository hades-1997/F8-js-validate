function Validator(options){

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
            
        }
    }
    var selectorRules = {};
    //Hàm thực hiện validate
    function validate(inputElement, rule){
        //var errorElement = getParent(inputElement,'.form-group')
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;
        //lấy ra các rules của selector
        var  rules = selectorRules[rule.selector]
        // kiểm tra từng rule được lặp qua 
        // dừng kiểm ra nếu sinh ra lỗi
        for(var i = 0; i < rules.length; ++i){
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                     break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break;
        }
        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid')
        }else{
            errorElement.innerText = '';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage
    }
    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement){
        // Lặp qua mỗi rule và xử lý (lắng nghe người dùng hành động)
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormValid;
            //lặp qua từng rule và validate
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                 var isValid =  validate(inputElement, rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            if(isFormValid){
                //Trường họp submit với javacript
                if(options.onSubmit === 'function'){
                    var enabaleInputs = formElement.querySelectorAll('[name]:not([])');
                    var formValues = Array.from(enabaleInputs).reduce(function(values, input){
                        switch(input.type){
                            case 'radio':
                            case 'checkbox':
                                if(input.matches(':checked')){
                                    values[input.name] = input.value
                                }
                            default:
                                values[input.name] = '';
                        }
                        values[input.name] = input.value
                        return value;
                    }, {});
                    options.onsubmit(formValues);
                }else{
                    // trường hợp submit với form mặc định
                    formElement.submit();
                }
            }else{
            }
        }
        options.rules.forEach(function(rule){
            //lưu lại các rules cho mỗi input 
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }
            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function (inputElement){
                //Xử lý trường hợp blur khỏi input
                inputElement.onblur = function(){
                    validate(inputElement, rule)
                }
                //Xử lý mỗi khi người dùng nhập vào input 
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            });
        });
    }
}

Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function (value){
            //.trim()
            return value ? undefined : 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là Email'
        }
    }
}

Validator.minLength = function(selector, min){
    return {
        selector: selector,
        test: function (value){
           
            return value.length>= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }

    }
}