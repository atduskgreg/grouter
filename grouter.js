var CompiledRoute = function(regex, captures){
  this.regex = regex;
  this.captures = captures;
  
  var thisRoute = this;
  
  this.doesMatch = function(request){
    if(m = request.match(thisRoute.regex)){
      var params = {};
      for (i = 1; i < m.length; i ++){
        params[captures[i-1]] = m[i];
      }
      return params;
    }
    else{
      return false;
    }
  }
}

var Router = {
    compiledRoutes : [],
    
    route : function(){
      var routableHash = window.location.hash.replace(/^#/, '');
      
      for (n = 0; n < Router.compiledRoutes.length; n ++){
        if(splat = Router.compiledRoutes[n].route.doesMatch(routableHash)){
          Router.compiledRoutes[n].action(splat);
        }
      }
    },
    
    addRoute : function(route, action){
      var patterns = Router.extractPatterns(route);
      var compiled = Router.compileRoute(patterns);
      Router.compiledRoutes.push({action: action, route: compiled});
    },
    
    compileRoute : function(patterns){
      var regexString = "^";
      var wildCardNames = [];
      for (i = 0; i < patterns.length; i ++){
        regexString += "\/" + patterns[i].pattern;
        
        if(patterns[i].wildcard)
          wildCardNames.push(patterns[i].name);
      }
      var r = new RegExp(regexString);
      return new CompiledRoute(r, wildCardNames);
    },
    
    extractPatterns : function(route){
      var parts = route.split("/")

      var urlParts = []
      
      for (i = 1; i < parts.length; i ++){
        if(m = parts[i].match(/:([a-z]*|[0-9]*)/))
          urlParts.push({wildcard : true, name : m[1], pattern : "([a-z]+|[0-9]+)"});
        else
          urlParts.push({wildcard : false, pattern : parts[i]});
      }
      
      return urlParts
    }
  }
  
var Route = function(myRoute, action){
  Router.addRoute(myRoute, action);
}