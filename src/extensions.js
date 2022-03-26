if (!Array.prototype.equals) {
    Array.prototype.equals = function (other) {
        if (!other || this.length != other.length) {
            return false;
        }
            
        return this.every(function(element, index) {
            return element === other[index]; 
        });
    }
}

if (!Array.prototype.clear) {
    Array.prototype.clear = function () {
        if (this.length > 0) {
            this.splice(0, this.length);
        }
    }
}