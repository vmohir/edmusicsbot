<?php

// requirements
require 'vendor/autoload.php';
require_once 'config.php';
// file_get_contents('https://api.telegram.org/bot'.$token.'/sendMessage?chat_id=92454&text=debug');
// require 'main-controller.php';
use Telegram\Bot\Api;

// connecting
$telegram = new Api($token);
// get user message
$updates        = $telegram->getWebhookUpdates();
$message        = $updates->getMessage();
$callback_query = $updates->getCallbackQuery();

if (isset($_GET['debug'])) {
    log_debug($_GET['debug']);
}

if ($message != null) {
    $chat       = $message->getChat();
    $chat_id    = (int) $chat->getId();
    $text       = $message->getText();
    $message_id = $message->getMessageId();
    $username   = $message->getFrom()->getUsername();
    $user       = $message->getFrom();
    $username   = $user->getUsername();
    $fullname   = $user->getFirstName() . ' ' . $user->getLastName();
    try {
        
        // $db = new Database($db_name, $db_user, $db_pass, $chat_id, $message_id);
        
        // vahid tests
        /*if ($chat_id == 92454) {
        }*/
        $telegram->sendMessage([
            'chat_id' => $admin_id,
            'text' => 'vahidte'
        ]);

        // $state = get_chat_state($text, $username, $fullname);
        // // log_debug($state);
        // if (!is_cancel_command($text, $chat_id, $message_id, $message)) {
        //     // log_debug($state);
        //     if (!handle_state($state, $chat_id, $text, $message_id, $message)) {
        //         // log_debug($state);
        //         if (!run_keyboard_button($text, $chat_id, $message_id, $message)) {
        //             // log_debug($state);
        //             run_commands($text, $chat_id, $message_id, $message);
        //         }
        //     }
        // }

    } catch (Exception $e) {
        log_debug(make_exception_array($e));
    }
// } elseif ($callback_query != null) {
//     $id      = $callback_query->getId();
//     $from    = $callback_query->getFrom();
//     $chat_id = $from->getId();
//     $message = $callback_query->getMessage();
//     $data    = $callback_query->getData();

//     try {
//         $db = new Database($db_name, $db_user, $db_pass, $chat_id);
//         run_callback_queries($id, $from, $message, $data);
//     } catch (Exception $e) {
//         log_debug(make_exception_array($e));
//     }
}
