
Application Log Monitor ��һ����Դ���򵥣����õ�Log Monitor

---


## ����������


1. **ͳһ��Ŀ�е�Log��ʽ������Ͱ汾�������console.info�ȵĽű���������
1. **�ÿ�����Ա���ڵͰ汾�������������IE6,Ҳ�ܿ���Log. ����Ͱ汾���������֮ʹ
1. **��ǰ�˸���Log�ļ�������Log,�淶Log����
1. **�ڵ��Խ׶Σ�����ֻ��ʾĳһ���Log,��߿���Ч��
1. **������ĳ�����ش���ʱ��������Ա�����ռ������Log�����͵���������




## Ŀǰ��Ƶ�ԭ��

jQuery PlugIn, �򵥣�����



## ĿǰAPI

- $.Logger
- $.Logger.setLogLevel
- $.Logger.setLogFilter

## ʹ��ʾ��

- var mylog=$.Logger("logger-monitor-tester");
- $.Logger.setLogLevel(4);  // logger-monitor-tester
- $.Logger.setLogFilter(/^.*monitor.*$/,function(msg){
-  //do the action , like send request to the back-end or store the log in some place
- });

- mylog.log("+++log test start+++");