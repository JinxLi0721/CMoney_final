// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var dialog;
var dialogBoard;
window.onload=function(){
    dialog=document.getElementById("dialog");
    dialogBoard=document.getElementById("dialogBoard");
};
function showDialog(){
    dialog.style.display="block";
};
function showDialogBoard(){
    dialogBoard.style.display="block";
};
function closeDialogBoard(){
    dialogBoard.style.display="none";
}