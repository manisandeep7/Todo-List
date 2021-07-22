module.exports.getdate=function()
{
    var day;
     var options = {  year: 'numeric', month: 'long', day: 'numeric' };
     var today=new Date();
    day=today.toLocaleDateString("en-US", options);
    return day;
}

exports.getday=function()
{
    var day;
    var options={weekday:'long'};
    var today=new Date();
    return today.toLocaleDateString("en-US",options);
}