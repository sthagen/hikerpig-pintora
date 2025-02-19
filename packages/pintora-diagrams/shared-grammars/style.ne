@lexer lexer

styleStatement ->
    "@style" %WS:* %L_BRACKET __ styleRules __ %R_BRACKET %WS:* %NL {% (d) => ({ type: 'style', rules: d[4] }) %}

styleRules ->
    null {% null %}
  | styleRules __ styleRule {%
      (d) => {
        const rules = d[0] || []
        if (d[2]) rules.push(d[2])
        return rules
      }
    %}

styleRule ->
    selector %WS:* %L_BRACKET __ styleAttrs __ %R_BRACKET %WS:* {%
      (d) => ({
        type: 'styleRule',
        selector: d[0],
        attrs: d[4]
      })
    %}

selector ->
    %VALID_TEXT {% function(d) {
      const v = tv(d[0])
      if (v[0] === '#') {
        return { type: 'id', target: v.slice(1) }
      } else if (v[0] === '.') {
        return { type: 'class', target: v.slice(1) }
      }
    } %}

styleAttrs ->
    null {% null %}
  | styleAttrs styleAttr {%
      (d) => {
        const attrs = d[0] || []
        if (d[1]) attrs.push(d[1])
        return attrs
      }
    %}

styleAttr ->
    %VALID_TEXT %WS:* %COLON %WS:* attrValue %WS:* %SEMICOLON __ {%
      (d) => ({
        type: 'attr',
        key: tv(d[0]),
        value: d[4]
      })
    %}

attrValue ->
    %VALID_TEXT {% (d) => tv(d[0]) %}
  | %QUOTED_WORD {% (d) => tv(d[0]) %}
