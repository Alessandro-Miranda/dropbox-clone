class DropboxController
{
    constructor()
    {
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector("#react-snackbar-root");
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.initEvents();
    }

    initEvents()
    {
        this.btnSendFileEl.addEventListener('click', () => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', event => {
            this.uploadTask(event.target.files);
            this.snackModalEl.style.display = 'block';
        })
    }

    uploadTask(files)
    {
        let promises = [];

        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();
                ajax.open('POST', '/upload');

                ajax.onload = () => {
                    try
                    {
                        resolve(JSON.parse(ajax.responseText));
                    }
                    catch(e)
                    {
                        reject(e);
                    }
                };

                ajax.onerror = e => reject(e);

                ajax.upload.onprogress = e => {
                    this.uploadProgress(e, files);
                }
                
                let formData = new FormData();
                formData.append('input-file', file);
                ajax.send(formData);
            }));
        });

        return Promise.all(promises);
    }

    uploadProgress(event, files)
    {
        let loaded = event.loaded;
        let total = event.total;
        let percent = parseInt((total / loaded) * 100);

        this.progressBarEl.style.width = `${percent}%`;
    }
}