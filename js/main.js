/**
 * Created by lzh on 2017/2/28.
 */

require.config( {
    paths: {
        'jquery': 'lib/jquery' ,
        'graph': 'app/base-obj/graph' ,
        'rect': 'app/base-obj/rect' ,
        'ball': 'app/base-obj/ball' ,
        'util': 'app/util' ,
        'HpBar': 'app/game-obj/HpBar' ,
        'PowerBar': 'app/game-obj/PowerBar' ,
        'Player': 'app/game-obj/Player' ,
        'background': 'app/game-obj/background' ,
        'Text': 'app/base-obj/text' ,
        'pitchdetect': 'app/pitchdetect' ,
        'Menu': 'app/menu' ,
        'Input': 'app/input' ,
        'jquery-text': 'lib/jquery.1.10.2'
    }
} );
var curPlayer , anoPlayer , pairNum , id, ifP1 = true;

var baseUrl = 'http://127.0.0.1:3000';

function change() {
    var a = curPlayer;
    curPlayer = anoPlayer;
    anoPlayer = a;
}

require( ['jquery' , 'PowerBar' , 'HpBar' , 'Player' , 'background' , 'Text' , 'pitchdetect' , 'Menu' , 'Input'] ,
    function ( $ , PowerBar , HpBar , Player , background , Text , voice , Menu , Input ) {
        $( function () {
            Input.pause();
            var matchButton = $( '#match' ) ,
                mainMenu = $( '#main-menu' ) ,
                inputWrapper = $( '#input-wrapper' ) ,
                input = inputWrapper.find( 'input' ) ,
                submitButton = $( '#submit' ) ,
                test = $( '#test' ),
                startButton = $('#start-button'),
                findButton = $('#find-button'),
                p1Name = '',
                p2Name = '',
                p1Id = -1,
                canvas = document.getElementById('canvas'),
                ctx = canvas.getContext('2d');
            console.log(ctx);

            matchButton.on( 'click' , function () {
                mainMenu.removeClass( 'fade-in ani-delay-1s' );
                mainMenu.addClass( 'fade-out' );
                inputWrapper.removeClass( 'hidden fade-out' );
                inputWrapper.addClass( 'fade-in ani-delay-1s' );
                Input.cont();
            } );

            test.on( 'click' , function () {
                // if (!mainMenu.hasClass( 'fade-out' )) {
                //     mainMenu.removeClass( 'fade-in ani-delay-1s ' );
                //     mainMenu.addClass( 'fade-out' );
                //     inputWrapper.removeClass( 'hidden fade-out' );
                //     inputWrapper.addClass( 'fade-in ani-delay-1s' );
                //     Input.cont();
                // } else {
                //     inputWrapper.removeClass( 'fade-in ani-delay-1s' );
                //     inputWrapper.addClass( 'fade-out' );
                //     mainMenu.removeClass( 'fade-out' );
                //     mainMenu.addClass( 'fade-in ani-delay-1s' );
                //     Input.pause();
                // }

                // var a = $('#round-begin');
                // a.removeClass('hidden');
                // a.addClass('ease-in');
                // window.setTimeout(function (  ) {
                //     a.addClass("hidden");
                //     a.removeClass('ease-in');
                // }, 4000);

                // var wait = $('#wait-data');
                // if(wait.hasClass('hidden')){
                //     wait.removeClass('hidden');
                // } else{
                //     wait.addClass('hidden');
                // }
                if($('.reload').hasClass('hidden') || $('.reload').hasClass('fade-out')){
                    $('.win').removeClass('hidden fade-out ani-delay-1s');
                    $('.reload').removeClass('hidden fade-out');
                    $('.reload').addClass('fade-in ani-delay-1s');
                    $("#game-win").letterfx({"fx":"fly-right fly-bottom spin", timing:300});
                } else{
                    $('.reload').removeClass('fade-in ani-delay-1-6s');
                    $('.reload').addClass('fade-out');
                    $('.win').addClass('fade-out ani-delay-1s');
                    $("#game-win").letterfx({fx:'fly-right fly-bottom spin', backwards:true, letter_end:'stay', timing:300, element_end:true});
                }
            } );

            $('.reload').click(function (  ) {
                $('.reload').removeClass('fade-in ani-delay-1-6s');
                $('.reload').addClass('fade-out');
                $('.win').addClass('fade-out ani-delay-1s');
                $("#game-win").letterfx({fx:'fly-right fly-bottom spin', backwards:true, letter_end:'stay', timing:300, element_end:true});
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                mainMenu.removeClass( 'fade-out' );
                mainMenu.addClass( 'fade-in ani-delay-1s' );
            });

            submitButton.on( 'click' , function () {
                var value = input[0].value;
                Input.pause();
                if (value !== '') {
                    $.ajax( baseUrl + '/getPlayer' , {
                        data: {
                            name: value
                        } ,
                        success: function ( data ) {
                            data = JSON.parse( data );
                            pairNum = data.pairNum;
                            p1Name = value;
                            ifP1 = data.player === 'p1';
                            id = data.id;
                        },
                        error: function (  ) {
                            inputWrapper.removeClass( 'hidden fade-out' );
                            inputWrapper.addClass( 'fade-in ani-delay-1s' );
                            Input.cont();
                        }
                    } )
                        .then(function (  ) {
                            return canStart();
                        })
                        .then(function ( data ) {
                            if(data){
                                p2Name = data;
                                window.setTimeout(function (  ) {
                                    findButton.click();
                                }, 3000);
                            }
                        });
                    inputWrapper.removeClass( 'fade-in ani-delay-1s' );
                    inputWrapper.addClass( 'fade-out' );
                    $.MyMessage( {
                        texts: [{text: "寻找对手中..."} ] ,
                        showhint: false ,
                        backgrounds: [{color: "#eee"}]
                    } );
                }
            } );
            startButton.on('click', function (  ) {
                $.MyMessageClose();
                Menu.fightMenu.init(ifP1, p1Name, p2Name, p1Id)
                .then( function () {
                    Menu.fightMenu.start();
                } );
            });
        } );

        var ifCanStart = false ;

        var canStart = function () {
            var defer = $.Deferred();

            var b = window.setInterval( function () {
                $.ajax( baseUrl + '/canStart' , {
                    data: {
                        p1: ifP1 ? 1 : 0 ,
                        pairNum: pairNum
                    } ,
                    timeout: 2000 ,
                    success: function ( data ) {
                        data = JSON.parse( data );
                        if (data.state === 'yes') {
                            ifCanStart = true;
                            console.log(data.anoPlayerName);
                            defer.resolve( data.anoPlayerName );
                            window.clearInterval( b );
                        }
                    } , error: function () {
                        window.clearInterval( b );
                        console.log( "error" );
                    }
                } )
            } , 1500 );
            return defer;
        };
    } );