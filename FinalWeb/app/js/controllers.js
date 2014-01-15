'use strict';

/**
 * De controllers zorgen voor de logica van de website
 * Voor elke pagina is er een controller voorzien.
 */

angular.module('myApp.controllers', [])
   .controller('HomeCtrl', ['$scope', 'syncData', function($scope, syncData) {
      syncData('syncedValue').$bind($scope, 'syncedValue');
   }])

  .controller('ClubCtrl', ['$scope', 'syncData','$location', function($scope, syncData,$location) {



      $scope.clubs = syncData('clubs',10);


        $scope.logout = function(){
            $location.path('/logout');
        }

        $scope.goDrink = function(club){


var i = 1;
        while($scope.clubs[i]!=null){
            if($scope.clubs[i].selected == 1){
                var list = new Firebase('https:://quickbase.firebaseio.com/clubs/'+$scope.clubs[i].id+'');

                list.update({id:$scope.clubs[i].id,name:$scope.clubs[i].name, selected:0});
                i++;

            }
            i++;
        }




            var newData = new Firebase('https:://quickbase.firebaseio.com/clubs/'+club.id+'');

            newData.update({id:club.id,name:club.name, selected:1});

            var total = new Firebase("https://quickbase.firebaseio.com/total");

            total.update({price:0});

           $location.path('/menu');



        }

   }])


    .controller('OrderCtrl',['$scope','syncData','$location',function($scope,syncData,$location){

        $scope.orderlist = true;
        $scope.orderbtn = true;
        $scope.drinksorder=[];


        $scope.logout = function(){
            $location.path('/logout');
        }



        $scope.printOrder = function(){


            var listclubs =  new Firebase("https://quickbase.firebaseio.com/clubs");



            listclubs.on('child_added',function(snapshot){
                var data = snapshot.val();
                if(data.selected == 1){

                    $scope.data = data;
                   $scope.drinks = syncData('drinks/'+data.name+'');



              var listorder = new Firebase('https://quickbase.firebaseio.com/drinks/'+$scope.data.name+'');

                    listorder.on('child_added',function(snapshot){
                        var put = snapshot.val();
                        if(put.count >0){
                     $scope.drinksorder.push(put);
                        }


                        var newData = new Firebase('https:://quickbase.firebaseio.com/drinks/'+$scope.data.name+'/'+put.id+'');

                        newData.update({name:put.name, id:put.id, count:0, price:2, totalprice:0, type:put.type })

                    })
                    var totals = new Firebase("https://quickbase.firebaseio.com/total");
                    totals.on('value',function(snapshot){
                         $scope.totalorder=snapshot.val().price;





                    })
                  $scope.orderlist=false;
                    $scope.orderbtn=false;






                }
            });
        }
    }])

















    .controller('MenuCtrl', ['$scope', 'syncData','$location', function($scope, syncData,$location) {

        $scope.data ="";
        $scope.tableshow = true;

        $scope.tabs = [{
            title:'beer'

        },

            {
                title:'wine'
            },
            {
                title:'strong'
            },
            {
                title:'soft'
            }
        ];

        $scope.currentTab = 'wine';

        $scope.onClickTab = function(tab){
            $scope.currentTab = tab.title;
            $scope.tableshow = false;
           $scope.menulist();

        }



        $scope.logout = function(){
            $location.path('/logout');
        }

$scope.order = function(){

    $location.path('/order');



}


$scope.menulist = function(){


       var listclubs =  new Firebase("https://quickbase.firebaseio.com/clubs");
       $scope.items = [];


        listclubs.on('child_added',function(snapshot){
             var data = snapshot.val();
            if(data.selected == 1){

                $scope.data = data;

                var drink = new Firebase("https://quickbase.firebaseio.com/drinks/"+data.name);
                drink.on('child_added',function(snapshot){
                     var dat = snapshot.val();



                    if(dat.type ==$scope.currentTab){
                        $scope.items.push(dat);





                    }

                $scope.drinks = $scope.items;
                })


                }


            })
}



        var total = new Firebase("https://quickbase.firebaseio.com/total");
        total.on('value',function(snapshot){
          $scope.totalp = snapshot.val().price;



        $scope.increment = function(drink){

            drink.count++;
            drink.totalprice = drink.count*drink.price;

            $scope.totalp = $scope.totalp + drink.price;



           var newData = new Firebase('https:://quickbase.firebaseio.com/drinks/'+$scope.data.name+'/'+drink.id+'');

            newData.update({name:drink.name, id:drink.id, count:drink.count, price:drink.price, totalprice:drink.totalprice, type:drink.type });

            var total = new Firebase("https://quickbase.firebaseio.com/total");

            total.update({price:$scope.totalp});




        }
        $scope.decrement = function(drink){



            if(drink.count >0){
            drink.count--;
                drink.totalprice = drink.totalprice -drink.price;
                if($scope.totalp >1){
                $scope.totalp = $scope.totalp - drink.price;

                    var newData = new Firebase('https:://quickbase.firebaseio.com/drinks/'+$scope.data.name+'/'+drink.id+'');

                    newData.update({name:drink.name, id:drink.id, count:drink.count, price:drink.price, totalprice:drink.totalprice, type:drink.type });

                    var total = new Firebase("https://quickbase.firebaseio.com/total");

                    total.update({price:$scope.totalp});

            }
            }

        }
        });



    }])

   .controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.$on('$firebaseAuth:login', function() {
         $location.replace();
         $location.path('/login');
      });

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                   $location.path('/club');
                  cb && cb(user);
               }
            });
         }
      };

      $scope.createAccount = function() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         else {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {

                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email);
                  });
               }
            });
         }
      };
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', function($scope, loginService, syncData, $location) {
      syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');



      $scope.logout = function() {
         loginService.logout();
         $location.path('/login');
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function() {
         $scope.err = null;
         $scope.msg = null;
      };

      $scope.updatePassword = function() {
         $scope.reset();
         loginService.changePassword(buildPwdParms());
      };

      function buildPwdParms() {
         return {
            email: $scope.auth.user.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.oldpass = null;
                  $scope.newpass = null;
                  $scope.confirm = null;
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }

   }]);