import re
text = open('index.html','r',encoding='utf-8').read()
start = text.find('<script type="module">')
end = text.find('</script>', start)
script = text[start:end]
print('{', script.count('{'), '}', script.count('}'), '(', script.count('('), ')', script.count(')'), '[', script.count('['), ']', script.count(']'))
stack = []
pairs = {')':'(', '}':'{', ']':'['}
mismatch = False
for i, ch in enumerate(script):
    if ch in '([{':
        stack.append((ch, i))
    elif ch in ')]}':
        if not stack or stack[-1][0] != pairs[ch]:
            print('mismatch', ch, 'at', i)
            mismatch = True
            break
        stack.pop()
if not mismatch:
    print('stack left', len(stack))
    if stack:
        print(stack[:20])
