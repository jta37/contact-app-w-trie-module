var ContactsFactories = angular.module("ContactsFactories", []);

// We want a factory that is going to help scope()
// 	when doing CRUD with Contact or Contacts 
// 	i.e. we need something to help do http (req/res)

ContactsFactories.factory("Contacts", ["$http", function ($http) {
	var api = {};
	// GET All Contacts

	// GET /contacts.json
	api.all = function() {

		// $http("/contacts.json");
		return $http.get("/contacts.json");
	};

	// update a single contact via their id
	// PATCH "/contacts/:id.json"
	// 	params => {contact: {cell: ..., name: ..., ...}}
	api.update = function (contact) {

		// remember to send the request, and include the data we want to get back
		// 	{contact: contact} is passed in as params to specify 
		return $http.patch("/contacts/" + contacts.id + ".json", {contact: contact});
	};

	// POST "/contacts.json"
	// 	params => { contact: {cell: ...., name: ..., ...}}
	api.create = function (contact) {
		return $http.post("/contacts.json", {contact: contact});
																			// required contact and permitted params.
	};

	//  DELETE "/contacts/:id.json"
	api.delete = function (contact) {
		return $http.delete("/contacts/" + contact.id + ".json");
	};

	return api;
}])


ContactsFactories.factory("Trie", function () {
	function Trie(){
    this.characters = {};
  };

  Trie.prototype.learn = function(word, index){
    index = index || 0;
    var letter = word[index];
    if (index < word.length) {
      // recursive condition
      if (this.characters[letter] === undefined) {
        this.characters[letter] = new Trie();
      }
      // recursively learn at next letter position
      this.characters[letter].learn(word, index + 1);
    } else {
      // terminal condition
      this.isWord  = true;
    }
    return this;
  };

  Trie.prototype.getWords = function(words, currentWord){
    words = words || [];
    currentWord = currentWord || "";

    if (this.isWord) {
      words.push(currentWord);
    }
    for (var character in this.characters){
      this.characters[character].getWords(words, currentWord + character);
    }
    return words;
  };

  Trie.prototype.find = function(word, index){
    index = index || 0;
    if (index === word.length) {
      return this;
    }

    if (this.characters[word[index]] !== undefined && index < word.length) {
        return this.characters[word[index]].find(word, index + 1);
    }
  };

  Trie.prototype.autoComplete = function(prefix){
    var foundNode = this.find(prefix);
    var words = [];
    if(foundNode) {
      foundNode.getWords(words, prefix);
    }
    return words;
  };
  return Trie
});