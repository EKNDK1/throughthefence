
        var url = '/PDF/test0.pdf'; // Path to your PDF file

        let myVar = "PDF/test0.pdf";
      
        //

        function onLoading(){
            randomizeLinks("link-container");
            addFromFile("main-container","beskrivelse.html")
        }

        function changeValue(newVal) {
          myVar = newVal
          url = newVal;;
          //document.getElementById('value').textContent = myVar;
          loadNewPdf(url);
        }

        function loadNewPdf(textName)
        {
        
        // Load the PDF
        var newUrl = "PDF/"+textName+".pdf"
        pdfjsLib.getDocument(newUrl).promise.then(function(pdf) {
            //console.log('PDF loaded, total pages:', pdf.numPages);

            const container = document.getElementById("pdf-container-hidden");
            const links = document.getElementById('link-container');
            const button  = document.getElementById('topLeftBtn-hidden');
            container.id = "pdf-container";
            links.id = 'link-container-hidden';
            button.id = 'topLeftBtn';

            addFromFile("main-container","PDF/"+textName+".html")
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
        const container = document.getElementById("pdf-container");
        const links = document.getElementById('link-container-hidden');
        const button  = document.getElementById('topLeftBtn');
        container.id = "pdf-container-hidden";
        links.id = 'link-container';
        button.id = 'topLeftBtn-hidden';
        addFromFile("main-container","beskrivelse.html")
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
    //window.onload = () => randomizeLinks("link-container");