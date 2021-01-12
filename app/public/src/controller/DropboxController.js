class DropboxController
{
    constructor()
    {
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector("#react-snackbar-root");
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.fileNameEl = this.snackModalEl.querySelector('.filename');
        this.timeLeftEl = this.snackModalEl.querySelector('.timeleft');
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
                    this.uploadProgress(e, file);
                }
                
                let formData = new FormData();
                formData.append('input-file', file);
                
                this.startUploadTime = Date.now();
                ajax.send(formData);
            }));
        });

        return Promise.all(promises);
    }

    uploadProgress(event, files)
    {
        let timeSpent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let percent = parseInt((loaded * 100) / total);
        let timeLeft = ((100 - percent) * timeSpent) / percent;

        this.progressBarEl.style.width = `${percent}%`;
        this.fileNameEl.innerHTML = files.name;
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeLeft);
    }

    formatTimeToHuman(duration)
    {
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
        
        if(hours > 0) 
        {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }
        
        if(minutes > 0)
        {
            return `${minutes} minutos e ${seconds} segundos`;
        }

        if(seconds > 0)
        {
            return `${seconds} segundos`;
        }
        else
        {
            return '';
        }
    }
}