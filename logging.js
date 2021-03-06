/**
*@class jQuery.getLogger
*@name   jQuery.getLogger
*@author   <a href="mailto:zhouquan.yezq@alibaba-inc.com">Zhouquan.yezq</a>
*@description jQuery.getLogger will return a logger instance, and it already solve the console
*script issue on lower browser version like IE6. and for the IE6 or other lower version, we use the log
monitor to show the log .
 <h2>How to use?<h2>
<pre>
  var mylog=jQuery.getLogger('com.company.project.moduleName');
  mylog.log('this is the log');
</pre>

TODO: add setting for time stampe 
*/
(function($){
   //the log constructor
   
   var log=function(){};
   log.level=4; //default level, show all the log,if you want to close the log, just set log level as -1
   log.cacheSize=1000;
   log.policy=[]; // the filter policy center
   
   var methods = [ "error", "warn", "info", "debug", "log"];//0-4 level 
   //log level not very clear compare with back-end  --log4j
   
   $.extend(log.prototype, {
    /***
          *  @name jQuery.getLogger#enabled
          * @function
          */
     enabled: function(lev) {
       if(lev>log.level ) {
         return false;
       }
       return true;
     },
     /***
          *  @name jQuery.getLogger#doFilter
          *  @description  if just one filter, so it means just show the log which meet the filter, and if have filter call back ,do it
          *  if have more filters, from the console, it will show all the logs to the user, but it will do every filter call back for it's condiction
          * @function
          */
	 doFilter: function() {
	   if(!(log.policy.length==1)) return true;
	   var f=log.policy[0];
	   f=f['fi'];
	   if(f.test && !f.test(arguments[0][0]) && !f.test(this.name())) {
	     return false
	   }
	   return true;
	 },
     name: function() {
       return this._name;
     },
     /***
          *  @name jQuery.getLogger#log
          * @function
          */
     log: function() {
        this._log(4, arguments);
     },
     /***
          *  @name jQuery.getLogger#debug
          * @function
          */
     debug: function() {
        this._log(3, arguments);
     },
     /***
          *  @name jQuery.getLogger#info
          * @function
          */
     info: function() {
        this._log(2, arguments);
     },
    /***
          *  @name jQuery.getLogger#warn
          * @function
          */
     warn: function() {
        this._log(1, arguments);
     },
     /***
          *  @name jQuery.getLogger#error
          * @function
          */
     error: function() {
        this._log(0, arguments);
     },
     _handler: function(level, name, msg){
        var method=methods[level];
        msg=[[method,name+" |"].join(" | ")].concat(Array.prototype.slice.call(msg));
             if(!log.logPool){
               log.logPool=[];
             }
			 if(log.logPool.length===log.cacheSize){
			    //if the cache log more than cacheSize , then remove the  previous first one.
			    log.logPool=log.logPool.slice(1);
			 }
             log.logPool.push(msg.join(''));
             if( this.monitor && this.monitor.trunOn ){ //$.browser.msie   Just IE or not
               this.monitor.appendMessage(msg.join(''));
             }
       if(self.console && self.console.error) {
           if(console.log.apply) {//IE8 do not work on this way. undefined
              console[method].apply(console, msg);       
           }else {
              console[console[method]?method:'log'](msg);
           }
       }
     },
	 
    _log: function(level, msg) {
      if (this.enabled(level) && this.doFilter(msg)) {
         this._handler(level,this.name(),msg);
		 var me=this;
		 log.policy.length>0?$.each(log.policy,function(index,e) {  // do every filter and execute it's callback
		   var f=e['fi'];
		   if(f && f.test &&  (f.test(msg) || f.test(me.name()))) {// if have filter action , do it
		     e['cb']? e['cb'](msg,window.location.href,( new Date() ).getTime()):'';
		   }
		 }):'';
		 
      }
    }
     
   });
   
   var logs={};//logs container
   //extend this getLoggger method as jQuery method
   $.extend({
     Logger: function(name) {
       if (!logs[name]) {
          logs[name] = new log(name);
          logs[name]._name=name;
        }
        return logs[name];
     }
    });
    $.extend($.Logger,{
	// all the Logger configuratin will set under Logger 
	 setLogLevel: function(level) {
	   log.level=level;
	 },
	/**
	 *  @param filter should be RegExp pattern
	 *  @cb this is the call back function, it will pass the log message into
	 *    the cb parameter as the first parameter. so user could do some action to process the log message , like
	 *    send the message to the back-end or others.  etc: cb(message, winodw.location.href,( new Date() ).getTime())
	 *    so user could get the enough information for log
	 */
	 setLogFilter: function(filter,cb) {
	   var fool={
	     'fi':filter
	   };
	   cb?(fool['cb']=cb):'';
	   log.policy.push(fool);
	   //cb?(log.filterAction=cb):'';
	 },
	 
	 /**
	 * setting the Monitor page url. Note: we should keep the target page and monior page  under same domain.
	 */
	 setMonitorPage: function(url) {
	   log.monitor?(log.monitor.MONITOR_PAGE)=url:'';
	 },
	 
	 gc: function() { //should parent level call it
	   log=null;
	 }
	 
   });   
   
})(jQuery);
