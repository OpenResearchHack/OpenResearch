(function($) {
    "use strict"; // Start of use strict

    var bitcore = require('bitcore');

    $("#register").click(function () {
        $(".newAccountRegistered").show();
        $('#register').attr("disabled", "disabled");

        var privateKey = new bitcore.PrivateKey('testnet');
        var address = privateKey.toAddress().toString();
        var exported = privateKey.toWIF();

        $(".newAddress").val(address);
        $("#copy-address").attr( "data-clipboard-text", address );
        $(".newKey").val(exported);
        $("#key-address").attr( "data-clipboard-text", exported );

    });

    $("#goForward").click(function () {
        $(".usernameBox").show();
        $('#goForward').hide();
        $('.btc-warning').hide();
    });

    $( ".username" ).keyup(function() {
        $(".submitToBC").show();
    });

    $('#submitAccount').click(function () {

        /*if ($("#key").val() == "") {
            alert("Don't forget to fill your key before sending, it might be useful");
            return;
        }*/

        $('#submitAccount').attr("disabled", "disabled");
        $(".usernameError").hide();

        var newAddress = $('.newAddress').val();
        var username = $('.username').val();
        var mess= "OR,"+username;
        var address = "mnGLUMcJR9hVwLSTQb4P7zPdE5gTvJTTLJ";
        var messageType = $("#message-selection").val();

        var encoding = "message";
        var isLocal = false;
        var key = $("#key").val();

        

        var message= { mess, address, newAddress, isLocal, key, username };

        verifyUsername(message);

    });



    function sendMessage(message){
        var bitcore = require('bitcore');
        var Buffer = bitcore.Buffer;
        var message = message;
        var myPrivKey = message.key;
        var api_key_id = '50eda91debdf37f524f2a1be3653d291';
        var url = 'https://testnet-api.smartbit.com.au/v1/blockchain/address/' + message.address + '/unspent';
        
        $.ajax({
            url: url,
            type: 'GET',
            data: {'api-key-id': api_key_id},
            success: function(data) {

                var utxo;
                data.unspent.some(function (UTXO, index, _ary) {
                    if ( UTXO.value_int > 10000 && UTXO.confirmations > 0 ) {
                        utxo = {
                            "txId" : UTXO.txid,
                            "outputIndex" : UTXO.n,
                            "address" : message.address,
                            "script" : UTXO.script_pub_key.hex,
                            "satoshis" : UTXO.value_int
                        };
                        return true;
                    }; 
                });

                if (!utxo) {
                    alert("No available outputs to send a message");
                } else {
                    var privateKey = bitcore.PrivateKey.fromWIF("91jBH3Mt4HVTiGRJBs6XQFPwabWNSHrspj8nPhY18cjAGzp4zSk");

                    var transaction = new bitcore.Transaction()
                        .from(utxo)
                        .to(message.newAddress, 20000)
                        .addData(message.mess) // Add OP_RETURN data
                        .change(message.address)
                        .sign(privateKey)
                        .serialize(true);
                    //socket.emit('transaction', transaction);
                    sendTx(transaction);
                    //console.log(transaction);
                }
            }
        });
    }

    function sendTx(transaction){
        transaction = JSON.stringify({"hex":transaction});
        $.ajax({
            url: "https://testnet-api.smartbit.com.au/v1/blockchain/pushtx",
            type: 'POST',
            data: transaction,
            success: function(data) {
                alert(data);
            },
            error: function(e) {
                console.log(e);
            }
        });
    }

    $('#verifyUsername').click(function () {

        /*if ($("#key").val() == "") {
            alert("Don't forget to fill your key before sending, it might be useful");
            return;
        }*/


        var username = $('.username').val();
        var address = "mnGLUMcJR9hVwLSTQb4P7zPdE5gTvJTTLJ";

        var message= { username, address };
        verifyUsername(message);

    });

    function verifyUsername(message){
        var api_key_id = '50eda91debdf37f524f2a1be3653d291';
        var url = 'https://testnet-api.smartbit.com.au/v1/blockchain/address/' + message.address + '/op-returns';
        $.ajax({
            url: url,
            type: 'GET',
            data: {'api-key-id': api_key_id},
            success: function(data) {
                var usernames = getUsernames(data.op_returns);
                var isTaken = isUsernameTaken(message.username, usernames);
                if (isTaken) {
                    setUserError(message.username);
                } else {
                    sendMessage(message)
                }
            }
        });
    }

    function getUsernames(data){
        var usernames = [];
        data.forEach(function(entry) {
            var username = entry.op_return.text.split(",")[1];
            if (username){
                usernames.push(username);
            }
        });
        return(usernames);
    }

    function isUsernameTaken(username, usernames){
        if (usernames.indexOf(username) > -1) {
            return true;
        } else {
            return false;
        }
    }

    function setUserError(username){
        $(".usernameError").html("The username "+username+" is already taken");
        $(".usernameError").show();
        $('#submitAccount').removeAttr("disabled");
    }

})(jQuery); // End of use strict
