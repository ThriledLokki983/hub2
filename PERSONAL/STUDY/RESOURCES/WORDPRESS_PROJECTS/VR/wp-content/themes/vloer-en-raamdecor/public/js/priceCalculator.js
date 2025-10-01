const squareMeterInputHandler = () => {
    const input = document.querySelector('#sqm-input');
    input.addEventListener('change', () => {
        document.querySelector('#packs-input').value = '';

        const form = new FormData();
        form.append('action', 'vr_ajax_calculate_price_by_square_meters');
        form.append('productId', input.getAttribute('data-product-id'));
        form.append('squareMeters', input.value);
        const params = new URLSearchParams(form);

        fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
            },
            body: params
        }).then((response) => {
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json()
        }).then((data) => {
            console.log(data);
        }).catch((reason) => {
            console.log(reason);
            alert('An error occurred while making the calculation. Please try again.')
        })
    });
};

const packInputHandler = () => {
    const input = document.querySelector('#packs-input');
    input.addEventListener('change', () => {
        document.querySelector('#sqm-input').value = '';

        const form = new FormData();
        form.append('action', 'vr_ajax_calculate_price_by_number_of_packs');
        form.append('productId', input.getAttribute('data-product-id'));
        form.append('packsCount', input.value);
        const params = new URLSearchParams(form);

        fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
            },
            body: params
        }).then((response) => {
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json()
        }).then((data) => {
            console.log(data);
        }).catch((reason) => {
            console.log(reason);
            alert('An error occurred while making the calculation. Please try again.')
        })
    });
};

export default {
    squareMeterInputHandler,
    packInputHandler
};