

function setBoardSizeArray(board){
    var size = this.board.length;
    var arraySize= [];
    var i=0;
    while( i < size){
        arraySize.push(i);
        i++;
    }
    return arraySize;
}