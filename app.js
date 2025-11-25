let pdfView = false;
let scattered = true;

let storedWidth = window.innerWidth;
let storedHeight = window.innerHeight;

function windowSizeChanged() {
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;

  if (currentWidth !== storedWidth || currentHeight !== storedHeight) {
    return true;   // size changed
  }
  return false;    // size is the same
}


        function onLoading(){
            document.querySelectorAll(".data-link").forEach(link => {
                link.querySelector('.title').textContent = link.dataset.title;
              });
        

            addFromFile("main-container","beskrivelse.html");
            randomizeLinks("link-container");
        }

        function changeValue(link,newVal) {
          myVar = newVal;
          url = newVal;
          textPath = "PDF/" + newVal + ".txt";
          addInfo(link);
            
        doSomethingIfFileExists(textPath,"extraText")
          //document.getElementById('value').textContent = myVar;
          loadNewPdf(url);
        }

        async function doSomethingIfFileExists(path,div) {
            const exists = await fileExists(path);
            if (exists) {
              // run code that should run only if file exists
              loadTextIntoDiv(path,div)
              console.log("File exists — run success code");
            } else {
              console.log("File does not exist — run fallback");
            }
          }

        function loadNewPdf(textName)
        {
        
        // Load the PDF
        var newUrl = "PDF/"+textName+".pdf"
        pdfjsLib.getDocument(newUrl).promise.then(function(pdf) {
            pdfView = true;
            document.getElementById("sort_btn").classList.add("invis");
            document.getElementById("x_btn").classList.remove("invis");
            document.getElementById("background").classList.remove("invis");
            document.getElementById("background").classList.add("vis");
            //console.log('PDF loaded, total pages:', pdf.numPages);

            const container = document.getElementById("pdf-container-hidden");
            const links = document.getElementById('link-container');
            container.id = "pdf-container";
            links.id = 'link-container-hidden';

           // addFromFile("main-container","PDF/"+textName+".html")
           
            //clear previous pages
            container.innerHTML = "";

            // Loop through all pages
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                pdf.getPage(pageNumber).then(function(page) {
                    const scale = 1.5;
                    const viewport = page.getViewport({ scale: scale });

                    // Create a canvas for this page
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Append the canvas to the container
                    container.appendChild(canvas);

                    // Render the page
                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise.then(function() {
                        console.log(`Page ${page.pageNumber} rendered`);
                    });
                });
            }
        }).catch(function(error) {
            console.error('Error loading PDF:', error);
        });

        //addFromFile("content-container","button.html");
    }

    async function addFromFile(containerID,filename) {
        const container = document.getElementById(containerID);
        container.innerHTML = "";
        try {
          const response = await fetch(filename);
          if (!response.ok) throw new Error("File not found: " + filename);
    
          const html = await response.text();
    
          const wrapper = document.createElement("div");
          wrapper.className = "loaded";
          wrapper.innerHTML = html;
    
          container.appendChild(wrapper);
        } catch (err) {
          console.error(err);
          alert("Could not load file: " + filename);
        }
      }

    function backToMain() {
        pdfView = false;
        const container = document.getElementById("pdf-container");
        const links = document.getElementById('link-container-hidden');
        document.getElementById("sort_btn").classList.remove("invis");
        document.getElementById("x_btn").classList.add("invis");
        document.getElementById("background").classList.add("invis");
        document.getElementById("background").classList.remove("vis");
        container.id = "pdf-container-hidden";
        links.id = 'link-container';
        addFromFile("main-container","beskrivelse.html")
      }
  
      let resizeTimer;

      window.addEventListener('resize', () => {
      
        // Clear any previous timer
        clearTimeout(resizeTimer);
  
        // Start a new timer — triggers 300ms *after* last resize event
        resizeTimer = setTimeout(() => {
          onResizeEnd();
        }, 300);
        
      });
  
      function onResizeEnd() {
        if (pdfView == false) {
            randomizeLinks("link-container");
        }
      }
      
function scatterLinks(containerId) {
    document.getElementById("link-container").classList.replace("listed", "scatter");
    document.querySelectorAll('.data-link').forEach(link => {
        link.querySelector('.author').textContent = "";
        link.querySelector('.date').textContent = "";
      });
      if (windowSizeChanged()){
        randomizeLinks("link-container");
        storedWidth = window.innerWidth;
        storedHeight = window.innerHeight;
      }
   scattered = true;
}


function sortLinksByDate(containerId, newestFirst = true) {
        const container = document.getElementById(containerId);
        document.getElementById("link-container").classList.replace("scatter", "listed");

        const links = Array.from(container.querySelectorAll('a'));
        
        document.querySelectorAll('.data-link').forEach(link => {
        link.querySelector('.title').textContent = link.dataset.title;
        link.querySelector('.author').textContent = link.dataset.author;
        link.querySelector('.date').textContent = link.dataset.date;

        if (scattered)
        {
            storedWidth = window.innerWidth;
            storedHeight = window.innerHeight;
            scattered = false;
        }
       
          });

        // Sort by date
        links.sort((a, b) => {
          const dateA = new Date(a.dataset.date);
          const dateB = new Date(b.dataset.date);
          return newestFirst ? dateB - dateA : dateA - dateB;
        });
  
        // Remove all current links
        container.innerHTML = '';
  
        // Append links in sorted order
        links.forEach(link => container.appendChild(link));
      }

      function randomizeLinks(containerId) {
        const container = document.getElementById(containerId);
        const links = container.querySelectorAll('a');
    
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
    
        links.forEach(link => {
          const linkWidth = link.offsetWidth;
          const linkHeight = link.offsetHeight;
    
          // random position but ensure the link fits inside the container
          const x = Math.random() * (containerWidth - linkWidth);
          const y = Math.random() * (containerHeight - linkHeight);
    
          link.style.left = `${x}px`;
          link.style.top = `${y}px`;
        });
      }
    
      // run when the page loads
    window.onload = () => onLoading();
   

    document.addEventListener("DOMContentLoaded", () => {
        console.log("loaded")
        const container = document.getElementById("sort_btn");
        if (!container) {
          console.error("buttonContainer not found!");
          return;
        }
      
        container.addEventListener("click", event => {
          if (event.target.tagName === "BUTTON") {
            container.querySelectorAll("button")
                     .forEach(btn => btn.classList.remove("active"));
            event.target.classList.add("active");
          }
        });
      });

function addInfo(link){
    console.log("clicked")
    const box = document.getElementById("main-container");

    const title  = link.dataset.title;
    const date   = link.dataset.date;
    const author = link.dataset.author;

    box.innerHTML = `
    <h1>${title}</h1>
    <p><i>Date - </i> ${date}</p>
    <p><i>Author - </i> ${author}</p>
    <div id="description"></div>
    <div id="extraText" class="invis"></div>
    `;
}

function loadTextIntoDiv(txtFilePath, containerId) {
    const container = document.getElementById(containerId);
    const box = document.getElementById("description");
    box.innerHTML += "<p><em>Text:</em></p>"; 
    container.classList.remove("invis");

    fetch(txtFilePath)
        .then(response => response.text())
        .then(text => {
            // Split into paragraphs at blank lines or line breaks
            const paragraphs = text.split(/\r?\n\r?\n|(\r?\n)/).filter(p => p && p.trim());

            paragraphs.forEach(p => {
                const paragraph = document.createElement("p");
                paragraph.textContent = p.trim();
                container.appendChild(paragraph);
            });
        })
        .catch(err => console.error("Error loading text file:", err));
}

async function fileExists(path) {
    try {
        const response = await fetch(path, { method: "HEAD" });
        return response.ok;
    } catch (e) {
        return false;
    }
}


