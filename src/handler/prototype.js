String.prototype.replaceLast = function (find, replace) {
  if (typeof replace === "object") {
    replace = "";
  }

  const index = this.lastIndexOf(find);

  if (index >= 0) {
    return (
      this.substring(0, index) + replace + this.substring(index + find.length)
    );
  }

  return this.toString();
};

Array.prototype.removeDuplicates = function () {
  return this.filter(function (item, index, self) {
    return self.indexOf(item) == index;
  });
};