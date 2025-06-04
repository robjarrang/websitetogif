document.getElementById('gifForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const width = parseInt(document.getElementById('width').value, 10);
    const frameRate = parseInt(document.getElementById('frameRate').value, 10);
    const length = parseInt(document.getElementById('length').value, 10);

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';

    try {
        const response = await fetch('/api/generate-gif', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, width, frameRate, length })
        });

        if (!response.ok) {
            throw new Error('Failed to generate GIF');
        }

        const data = await response.json();
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = data.gif;
        downloadLink.download = 'website.gif';

        document.getElementById('loading').style.display = 'none';
        document.getElementById('result').style.display = 'block';
    } catch (error) {
        console.error('Error generating GIF:', error);
        document.getElementById('loading').style.display = 'none';
    }
});
