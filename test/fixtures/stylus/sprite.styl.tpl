{{!Switch delimiter to `<%` not `{{` to allow Stylus' built in {$foo} to work}}
{{=<% %>=}}
//
// Do not make changes to this file – they may be automatically overridden.
// Last generated: <%date%>
//

//
// `@block` for each icon to be extended throughout the site
// Docs: http://learnboost.github.io/stylus/docs/block.html
//

<%#shapes%>
<%#selector.shape%>$<%expression%><%/selector.shape%> =
<%#sprite%>
  background-position (<%position.absolute.x%> - <%padding.left%>)px (<%position.absolute.y%> - <%padding.top%>)px
  width <%width.inner%>px
  height <%height.inner%>px
<%/sprite%>

<%/shapes%>

//
// Create modified selectors which call `@block`s
//

<%#shapes%>
<%#selector.shape%>.<%expression%><%/selector.shape%>
<%#sprite%>
  {<%#selector.shape%>$<%expression%><%/selector.shape%>}
<%/sprite%>

<%/shapes%>
