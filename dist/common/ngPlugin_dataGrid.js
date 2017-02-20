
//默认配置
commonApp.value('lang', 'cn');
commonApp.value('multiple', 'false'); 
commonApp.value('pagerows', null);
commonApp.value('pageIndex', 1);
commonApp.value('pageCount', null);

//字典的工厂模式
commonApp.factory('dictionaryFactory',['$http','lang',function($http, lang){
    var obj = {};
    obj.initDictionary = function(_callback){
        $http.get(common.baseUrl + 'dictionary.txt').success(function(response){
            _callback(response);
        })
    };
    obj.fetchDictionary = function(_key, _dictionary, _lang){
        // console.log(_dictionary[_key])
        if(typeof _lang == 'undefined'){
            _lang = lang;
        }
        if(_dictionary && _dictionary[_key]){
            return _dictionary[_key][_lang];
        }
        return null;
    };
    return obj;
}])
//点击、搜索的构造函数
commonApp.service('datagridService',['$http',function($http){
    //行点击
    this.trClick = function(_tr, _index, _event, scope, attrs){
        if(typeof attrs.multiple == 'undefined'){
            attrs.multiple = multiple;
        }
        if (attrs.multiple == 'true') {
            $(_event.target).closest('tr').toggleClass('tractive');
        } else {
            $(_event.target).closest('tr').addClass('tractive').siblings('tr').removeClass('tractive');
        }
    };
    //搜索
    this.search = function(_obj){
        // console.log(_obj.columnKey)
        if(_obj.columnKey && _obj.keyWord){

            if(JSON.stringify(_obj.param[_obj.columnKey]).indexOf(_obj.keyWord) > -1){
                _obj.total ++;
                
                if(_obj.source[_obj.source.length-1][_obj.id] == _obj.param[_obj.id]){
                    _obj.pageCount = Math.ceil(_obj.total / _obj.pageRows);
                    _obj.total = 0;
                }
                return {
                    n1: _obj.param,
                    n2: _obj.pageCount,
                    n3: _obj.total
                };
            }else{
                if(_obj.source[_obj.source.length-1][_obj.id] == _obj.param[_obj.id]){
                    _obj.pageCount = Math.ceil(_obj.total / _obj.pageRows);
                    _obj.total = 0;
                }
                return {
                    n1: null,
                    n2: _obj.pageCount,
                    n3: _obj.total
                };
            }
        }else{
            return {
                n1: _obj.param,
                n2: Math.ceil(_obj.source.length / _obj.pageRows),
                n3: 0
            };
        }
    },
    //修改
    this.modify = function(index_id, _keyname, _event, scope){
        var tdarr = $(_event.target).parents('tr').find('td').not(':last-child').not(':nth-child('+(_keyname.length+1)+')');
        var changeObj = {};
        var flag = false;
        var textArr = [];
        var newtextArr = [];
        angular.forEach(tdarr, function(element, index) {
            var oldText = $(element).text();
            textArr.push(oldText);
            newtextArr.push(oldText);
            var input = $('<input type="text" value="'+ oldText +'"/>');
            input.css({'border':0,"color":"#222","border":"1px solid #ccc","border-radius":"3px","padding":"2px 3px"});
            // input.click(function(){
            //     return false;
            // });
            // console.log(input)
            $(element).html(input);
            input.blur(function(event){
                var newText = $(this).val();
                if(oldText != newText){
                    flag = true;
                    newtextArr[index] = newText;
                    var ind = $(this).parent().index();
                    changeObj[_keyname[ind]["key"]] = newText;
                }else{
                    flag = false;
                }
            })
        });
        $(document).click(function(evt){
            if(evt.target.tagName != "INPUT" && evt.target.tagName != "TD" && evt.target.tagName != "BUTTON"){
                angular.forEach(tdarr, function(element, index) {
                    $(element).html(newtextArr[index]);
                })
                if(flag){
                    flag = false;
                    $.confirm("内容已修改, 是否保存?","温馨提示");
                    $('.btn-default').click(function(e){
                        if($(e.target).text() == "确定"){
                            // console.log(newtextArr)
                            $http.post('order_modify.php',{form: scope.form, indexid: index_id, obj: JSON.stringify(changeObj)}).success(function(response){
                                $.alert(response.msg,"温馨提示");
                            })
                        }else{
                            angular.forEach(tdarr, function(element, index) {
                                // console.log(element)
                                $(element).html(textArr[index]);
                            })
                        }
                    })
                }
            }
        })
    },
    //删除
    this.del = function(_indexid, _event, scope){
        var self = this;
        $.confirm("确定删除?","温馨提示");
        $('.btn-default').click(function(event){
            if($(event.target).text() == "确定"){
                $http.post('order_del.php',{indexid: _indexid, form: scope.form}).success(function(response){
                    if(response.state){
                        $.alert(response.msg,"温馨提示");
                        $http.get(scope.form + '.php').success(function(response){
                            scope.dataSource = response.data;
                        })
                        // $(_event.target).parents('tr').remove();
                        // angular.forEach(scope.dataSource, function(element, index, array) {
                        //     if(element.order_id == _orderid){
                        //         scope.dataSource.splice(index, 1);
                        //     }
                        // });
                    }
                })   
            }
        })
    };
    //转到添加页面
    this.toAdd = function(scope){
        $('.modify').css("left","300px");
        $(document).scrollTop(0);
        $('.formdetail').addClass('item-hidden');
        $('tbody>tr>td:first-child>input','.modify').val(scope.dataSource.length + 1);
    };
    //增加、保存
    this.save = function(scope){
        var objarr = [];
        var reflag = true;
        angular.forEach($('tbody>tr','.modify'), function(element, index) {
            var flag = false;
            var minobjarr = [];
            angular.forEach($(element).find('td>input'), function(_element, _index) {
                if(_index != 0){
                    minobjarr.push($(_element).val());
                }
                if($(_element).val() && _index != 0){
                    flag = true;
                    reflag = false;
                }
            });
            if(flag){
                objarr.push(minobjarr);
            }
        });
        if(reflag){
            $.alert("没有添加数据","温馨提示");
        }else{
            $http.post('order_save.php',{obj: JSON.stringify(objarr), form: scope.form}).success(function(response){
                if(response.state){
                    $http.get(scope.api).success(function(_response){
                       scope.dataSource =  _response.data;
                   })
                    $('.modify').css("left","100%");
                    $('.formdetail').removeClass('item-hidden');
                    $('tbody>tr>td>input','.modify').val('');
                    $('tbody>tr','.modify').not(':first-child').remove();
                }
                $.alert(response.msg,"温馨提示");
            })
        }
    };
    //添加
    this.add = function(_obj, scope){
        scope.trNum += 1;
        var html = '<tr>';
        $.each(_obj, function(ele, index){
            if(ele != "$$hashKey"){
                if(ele == "indexid"){
                    html += '<td><input type="text" value="'+ (scope.trNum + 1) +'"></td>';
                }else{
                    html += '<td><input type="text" value=""></td>';
                }
                    
            }
        })
        html += '</tr>';
        $('tbody','.modify').append($(html));
    };
    //取消
    this.cancel = function(scope){
        scope.trNum = scope.dataSource.length;
        $('.formdetail').removeClass('item-hidden');
        $('.modify').css("left","100%");
        $('tbody>tr>td>input','.modify').val('');
        $('tbody>tr','.modify').not(':first-child').remove();
    };
}])
//翻页按钮数字
commonApp.filter('range',function(){
    return function(array,range){
        for (var i = 1; i <= range; i++) {
            array.push(i);
        }
        return array;
    }
})

commonApp.directive('datagrid', ['multiple','pagerows',function (multiple, pagerows) {
    return {
        restrict: 'E',
        templateUrl: 'template/datagrid.html',
        scope: {},
        controller: function ($scope, $element, $attrs, $http, dictionaryFactory, datagridService) {
            $scope.columns = [];
            $scope.pageIndex = 1;
            $scope.colspan = 0;
            $scope.form = localStorage.getItem("from");
            var _columnKey = null;
            $scope.api = $attrs.api;
            $http.get($attrs.api).success(function (response) {
                //数据源
                $scope.dataSource = response.data;
                $scope.trNum = $scope.dataSource.length;
                //字典检索
                dictionaryFactory.initDictionary(function(_dictionary){
                    for(var key in $scope.dataSource[0]){
                        if(key != '$$hashKey'){
                            var columnName = dictionaryFactory.fetchDictionary(key,_dictionary,$attrs.lang);
                            $scope.columns.push({'key': key, 'columnName': columnName});
                        }
                        $scope.colspan += 1;
                        var total = 0;
                        $scope.search = function(param1){
                            var obj = {
                                scope: $scope,
                                param: param1,
                                columnKey: _columnKey,
                                keyWord:  $scope.keyWord,
                                source: $scope.dataSource,
                                total: total,
                                pageRows: $scope.pagerows,
                                pageCount: $scope.pageCount,
                                id: $scope.columns[0].key
                            };
                            var obj = datagridService.search(obj);
                            // console.log(obj)
                            $scope.pageCount = obj.n2;
                            total = obj.n3;
                            return obj.n1;
                        }
                    }
                })
                if($attrs.page == 'true' && $attrs.pagerows*1 > 0){
                    $('tfoot').removeClass('item-hidden');
                    $scope.pagerows = $attrs.pagerows * 1;
                    $scope.pageCount = Math.ceil($scope.dataSource.length / ($attrs.pagerows * 1));
                }
            });

            $scope.trClick = function (_tr, _index, _event) {
                datagridService.trClick(_tr, _index, _event, $scope, $attrs);
            };
            $scope.btnClick = function(){
                datagridService.btnClick();
            };
            $scope.page = function(_p){
                $scope.pageIndex = _p;
            };
            $scope.changeColumn = function(){
                $scope.keyWord = '';
                for(var i = 0; i < $scope.columns.length; i++){
                    if($scope.columns[i].columnName == $scope.columnKey){
                        _columnKey = $scope.columns[i].key;
                    }
                }
            };
            $scope.modify = function(indexid, keyname, event){
                datagridService.modify(indexid, keyname, event, $scope);
            };
            $scope.del = function(indexid, event){
                datagridService.del(indexid, event, $scope);
            };
            $scope.toAdd = function(){
                datagridService.toAdd($scope);
            };
            $scope.save = function(){
                datagridService.save($scope);
            };
            $scope.add = function(obj){
                datagridService.add(obj, $scope);
            };
            $scope.cancel = function(){
                datagridService.cancel($scope);
            };
            $scope.slideUp = function(evt){
                $(evt.target).parent().slideUp(function(){
                    $(evt.target).hide();
                });
            };
        },
        link: function (_scope, _element, _attrs) {

        }
    }
}])
