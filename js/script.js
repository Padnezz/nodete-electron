const { ipcRenderer } = require('electron');
var cy;
function updateInTraffic(node, interface, traffic) {

}

function addNode(ip, hostname){
  ipcRenderer.send('addNode', '{"status":"REQ", "ip":"'+ip+'", "hostname":"'+hostname+'"}');
  cy.add({group: 'nodes', data: {id:hostname}, position: {x:100, y:300}});
  cy.style().selector("#" + hostname).style('label', hostname).update();
  saveVisual();
}

function addLink(source, target, source_int, target_int){
  source_int = source_int.replace("/", "--");
  target_int = target_int.replace("/", "--");
  ipcRenderer.send('addLink', '{"status":"REQ", "source":"'+source+'", "target":"'+target+'", "source_int":"'+source_int+'", "target_int":"'+target_int+'"}');
  var id = source + "-" + source_int + "_" + target + "-" + target_int;
  cy.add({group: 'edges', data: { id: id, source: source, target: target }});
  cy.style().selector("#" + id).style('line-color', "green").style("source-label", "0Mbit/s").style("target-label", "0Mbit/s").style("source-text-offset", "47px").style("target-text-offset", "47px").style("text-background-color", "black").style("text-background-opacity", "1").style("text-background-padding", "1px").style("color", "white").update();
  saveVisual();
}

function deleteNode(hostname){
  ipcRenderer.send('deleteNode', '{"status":"REQ", "hostname":"'+hostname+'"}');
  cy.remove("#"+hostname);
  saveVisual();
}

function deleteLink(hostname, interface){
  //cy.remove("#"+link);
  saveVisual();
  //interface = interface.replace("/", "--");
  ipcRenderer.send('deleteLink', '{"status":"REQ", "hostname":"'+hostname+'", "interface":"'+interface+'"}');
}

function saveVisual(){
  ipcRenderer.send('saveVisual', '{"status":"REQ", "cyjson":'+JSON.stringify(cy.json())+'}');
}

ipcRenderer.on('startVisual', (event, arg) => {
  var parseArg = JSON.parse(arg);
  console.log(arg);
  if(parseArg.status == "ACK"){
    /*parseArg.rows.forEach((row) => {
      console.log(row.hostname);
      cy.add({group: 'nodes', data: {id:row.hostname}, position: {x:100, y:300}});
      cy.style().selector("#"+row.hostname).style('label', row.hostname).update();
    });*/
    cy.json(parseArg.cyjson);
  }
});

$(document).ready(function () {
  cy = cytoscape({
    container: $("#cy")
  });
  ipcRenderer.send('startVisual', '{"status":"REQ"}');
  /*cy.add([
    { group: 'nodes', data: { id: 'n0' }, position: { x: 100, y: 100 } },
    { group: 'nodes', data: { id: 'n1' }, position: { x: 300, y: 300 } },
    { group: 'edges', data: { id: 'n0-Fa0_1--n1-Fa0_8', source: 'n0', target: 'n1' } }
  ]); */
  //cy.style("#n0-Fa0_1--n1-Fa0_8 {line-color:green; source-label:In 18.1Mbit/s; target-label:In: 30.4Mbit/s; source-text-offset: 45px; target-text-offset: 45px; text-background-color: black; text-background-opacity: 1; text-background-padding: 1px; color: white;}");
});