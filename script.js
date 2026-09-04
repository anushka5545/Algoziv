const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
$("#theme").onclick=()=>document.documentElement.classList.toggle("light");

const state={type:"stack",data:[],edges:[]};
const info={
 stack:["Stack Visualizer","STACK","Push","Pop","O(1)","LIFO: the last inserted value is removed first.","Push and pop happen at the top of the stack."],
 queue:["Queue Visualizer","QUEUE","Enqueue","Dequeue","O(1)","FIFO: the first inserted value is removed first.","Enqueue adds at the rear and dequeue removes from the front."],
 linkedlist:["Linked List Visualizer","LINKED LIST","Insert","Delete","O(n)","Nodes are connected sequentially using links.","Insert/delete changes the chain of connected nodes."],
 tree:["Binary Tree Visualizer","BINARY SEARCH TREE","Insert","Delete","O(log n) average","Left values are smaller and right values are larger.","BST insertion follows comparisons from the root."],
 graph:["Graph Visualizer","GRAPH","Add Edge","Remove Edge","O(V+E)","Vertices are connected by edges.","Edges connect vertices and BFS/DFS visit connected nodes."]
};
function log(t){$("#log").innerHTML+="<div>"+t+"</div>";$("#log").scrollTop=$("#log").scrollHeight}
function render(){
 const v=$("#visual");v.innerHTML="";
 if(state.type==="stack") state.data.slice().reverse().forEach((x,i)=>v.innerHTML+=`<div class="node">${x}${i===0?'<small style="display:block;color:var(--green)">TOP</small>':''}</div>`);
 else if(state.type==="queue") state.data.forEach((x,i)=>v.innerHTML+=`<div class="node">${x}${i===0?'<small style="display:block;color:var(--green)">FRONT</small>':''}${i===state.data.length-1?'<small style="display:block;color:var(--green)">REAR</small>':''}</div>`);
 else if(state.type==="linkedlist") state.data.forEach((x,i)=>v.innerHTML+=`<div class="node">${x}</div>${i<state.data.length-1?'<span class="arrow">→</span>':''}`);
 else if(state.type==="tree"){state.data.forEach(x=>v.innerHTML+=`<div class="node">${x}</div>`)}
 else {const nodes=[...new Set(state.edges.flat())];nodes.forEach(x=>v.innerHTML+=`<div class="node">${x}</div>`);if(state.edges.length)v.innerHTML+="<div style='width:100%;text-align:center;color:var(--muted)'>"+state.edges.map(e=>e.join(" — ")).join(" &nbsp; | &nbsp; ")+"</div>"}
 $("#typeLabel").textContent=info[state.type][1];$("#structureTitle").textContent=info[state.type][0];$("#mainAction").textContent=info[state.type][2];$("#removeAction").textContent=info[state.type][3];$("#complexity").textContent=info[state.type][4];$("#desc").textContent=info[state.type][5];
 $("#v2").classList.toggle("hidden",state.type!=="graph"); $("#search").style.display=state.type==="graph"?"none":"inline-block";$("#reverse").style.display=state.type==="graph"||state.type==="tree"?"none":"inline-block";$("#traverse").style.display=state.type==="stack"||state.type==="queue"?"none":"inline-block";
}
$$(".tabs button").forEach(b=>b.onclick=()=>{$$(".tabs button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.type=b.dataset.type;state.data=[];state.edges=[];log("Switched to "+state.type);render()});
$("#mainAction").onclick=()=>{let a=$("#v1").value.trim(),b=$("#v2").value.trim();if(!a){alert("Enter a value");return}if(state.type==="graph"){if(!b){alert("Enter second vertex");return}state.edges.push([a,b]);log(`Added edge ${a} — ${b}`)}else if(state.type==="tree"){state.data.push(+a||a);state.data.sort((x,y)=>x-y);log("Inserted "+a+" into BST")}else{state.data.push(a);log(info[state.type][2]+" "+a)}$("#v1").value="";render()};
$("#removeAction").onclick=()=>{if(state.type==="graph"){if(!state.edges.length)return;let e=state.edges.pop();log("Removed edge "+e.join(" — "))}else if(!state.data.length){log("Nothing to remove")}else{let x=state.type==="stack"?state.data.pop():state.data.shift();log(info[state.type][3]+" "+x)}render()};
$("#clear").onclick=()=>{state.data=[];state.edges=[];$("#log").innerHTML="";render()};
$("#search").onclick=()=>{let q=$("#v1").value.trim();if(!q)return alert("Enter a value to search");let i=state.data.map(String).indexOf(q);log(i>=0?`Found ${q} at position ${i}`:`${q} not found`)};
$("#reverse").onclick=()=>{state.data.reverse();log("Reversed the structure");render()};
$("#traverse").onclick=()=>{log("Traversal: "+state.data.join(" → "))};
render();

const algos={
 bubble:{title:"Bubble Sort",c:"O(n²)",p:`for i = 0 to n-1
  for j = 0 to n-i-2
    if A[j] > A[j+1]
      swap A[j], A[j+1]`},
 selection:{title:"Selection Sort",c:"O(n²)",p:`for i = 0 to n-1
  min = i
  for j = i+1 to n
    if A[j] < A[min]
      min = j
  swap A[i], A[min]`},
 insertion:{title:"Insertion Sort",c:"O(n²)",p:`for i = 1 to n-1
  key = A[i]
  move larger elements right
  insert key`},
 linear:{title:"Linear Search",c:"O(n)",p:`for each element x in A
  if x == target
    return position
return not found`},
 binary:{title:"Binary Search",c:"O(log n)",p:`sort A
low = 0, high = n-1
while low <= high
  mid = (low+high)/2
  compare A[mid] with target`},
 bfs:{title:"Breadth First Search (BFS)",c:"O(V+E)",p:`put start vertex in queue
mark it visited
while queue not empty
  remove front vertex
  visit unvisited neighbors
  add neighbors to queue`},
 dfs:{title:"Depth First Search (DFS)",c:"O(V+E)",p:`DFS(v):
  mark v visited
  for each unvisited neighbor
    DFS(neighbor)`}
};
let selectedAlgo="bubble";
$$(".algo-menu button").forEach(b=>b.onclick=()=>{selectedAlgo=b.dataset.algo;$$(".algo-menu button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");let a=algos[selectedAlgo];$("#algoTag").textContent="SELECTED ALGORITHM";$("#algoTitle").textContent=a.title;$("#algoComplexity").textContent=a.c;$("#pseudo").textContent=a.p});
function showArr(a){$("#arrayVisual").innerHTML=a.map(x=>`<div class="array-bar">${x}</div>`).join("")}
async function run(){
 let a=$("#algoInput").value.split(",").map(x=>x.trim()).filter(Boolean).map(x=>isNaN(x)?x:Number(x)),t=$("#target").value.trim();$("#steps").innerHTML="";
 const step=x=>{ $("#steps").innerHTML+=`<div>${x}</div>`;$("#steps").scrollTop=$("#steps").scrollHeight;showArr(a)};
 if(["bubble","selection","insertion"].includes(selectedAlgo)){
  if(selectedAlgo==="bubble")for(let i=0;i<a.length;i++)for(let j=0;j<a.length-i-1;j++){step(`Compare ${a[j]} and ${a[j+1]}`);if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];step("Swap performed")}}
  if(selectedAlgo==="selection")for(let i=0;i<a.length;i++){let m=i;for(let j=i+1;j<a.length;j++){step(`Compare ${a[m]} and ${a[j]}`);if(a[j]<a[m])m=j}if(m!==i){[a[i],a[m]]=[a[m],a[i]];step("Swap minimum into position "+i)}}
  if(selectedAlgo==="insertion")for(let i=1;i<a.length;i++){let k=a[i],j=i-1;step("Insert "+k);while(j>=0&&a[j]>k){a[j+1]=a[j];j--;step("Shift element")}a[j+1]=k;step("Placed "+k)}
  step("Sorted result: "+a.join(", "));
 }else if(selectedAlgo==="linear"){showArr(a);let found=false;for(let i=0;i<a.length;i++){step(`Check index ${i}: ${a[i]}`);if(String(a[i])===t){step(`✓ Found ${t} at index ${i}`);found=true;break}}if(!found)step(`✗ ${t} not found`)}
 else if(selectedAlgo==="binary"){a.sort((x,y)=>x-y);let l=0,r=a.length-1,found=false;while(l<=r){let m=Math.floor((l+r)/2);step(`Check middle ${a[m]}`);if(String(a[m])===t){step(`✓ Found ${t} at index ${m}`);found=true;break}if(a[m]<Number(t))l=m+1;else r=m-1}if(!found)step(`✗ ${t} not found`)}
 else {showArr(a);step(`${algos[selectedAlgo].title} demonstration: graph traversal requires graph edges. Use the Visualizer → Graph section for custom vertices and edges.`)}
}
$("#runAlgo").onclick=run;
$$(".algo-menu button")[0].click();