class ReviewExtractor {
    constructor() {
        this.extractedInfo = [];
    }

    extractReviewInfo() {
        const productHandleElement = document.querySelector('#rightContent > div.NhsUfVvY > div._1Zf27vaY > div > div');
        const productHandle = productHandleElement ? productHandleElement.textContent : '';

        const reviews = document.querySelectorAll('#reviewContent > div._3mn9Y0tf > div._2OaJDN8Y._3Rsl6Owq._1xAk_zzX > div._10EiyDKr._3hjIP4Y2._2gC1sYKf.HVCrPqZh > div > div > div > div:nth-child(3) > div > div > div');

        reviews.forEach((review) => {
            const authorNameElement = review.querySelector('.XTEkYdlM._3a8V1xkt');
            const authorName = authorNameElement ? authorNameElement.textContent : '';

            const reviewDateElement = review.querySelector('div.jr_zeQBk._2RiUeNfG > span:nth-child(3)');
            const reviewDate = reviewDateElement ? reviewDateElement.innerText : '';

            const starIcons = review.querySelectorAll('.ZJF4Fxlw svg');
            const numOfStars = starIcons.length;

            const bodyImages = review.querySelectorAll('.splide__list img');
            const pictureUrls = Array.from(bodyImages).map(img => img.src);

            const bodyTextElement = review.querySelector('span._2EO0yd2j');
            const bodyText = bodyTextElement ? bodyTextElement.textContent : '';

            if (authorName && bodyText) {
                // Add a new column 'reviewer_email' combining 'reviewer_name' and '@gmail.com'
                const reviewerEmail = `${authorName}@gmail.com`;

                this.extractedInfo.push({
                    'body': bodyText,
                    'rating': numOfStars,
                    'review_date': reviewDate,
                    'reviewer_name': authorName,
                    'reviewer_email': reviewerEmail,
                    'picture_urls': pictureUrls.join(';'), // Join image URLs as a string
                    'product_handle': productHandle
                });
            }
        });
    }

    convertJsonToCsv() {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "body,rating,review_date,reviewer_name,reviewer_email,picture_urls,product_handle\n"
            + this.extractedInfo.map(item => {
                return `"${item['body']}","${item['rating']}","${item['review_date']}","${item['reviewer_name']}","${item['reviewer_email']}","${item['picture_urls']}","${item['product_handle']}"`;
            }).join("\n");

        return encodeURI(csvContent);
    }

    downloadCsv() {
        this.extractReviewInfo();
        const csvData = this.convertJsonToCsv();
        const link = document.createElement('a');
        link.setAttribute('href', csvData);
        link.setAttribute('download', 'reviews.csv');
        document.body.appendChild(link);
        link.click();
    }

    convertJsonToJsonString() {
        this.extractReviewInfo();
        return JSON.stringify(this.extractedInfo);
    }

    downloadJson() {
        this.extractReviewInfo();
        const jsonData = this.convertJsonToJsonString();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'reviews.json');
        document.body.appendChild(link);
        link.click();
    }
}

// Dynamically create buttons and add them to the DOM
const csvButton = document.createElement('button');
csvButton.textContent = 'Download CSV';
csvButton.addEventListener('click', () => {
    const reviewExtractor = new ReviewExtractor();
    reviewExtractor.downloadCsv();
});

const jsonButton = document.createElement('button');
jsonButton.textContent = 'Download JSON';
jsonButton.addEventListener('click', () => {
    const reviewExtractor = new ReviewExtractor();
    reviewExtractor.downloadJson();
});

const targetDiv = document.querySelector('div._39vL3TE4');
targetDiv.insertAdjacentElement('afterend', document.createElement('br'));
targetDiv.insertAdjacentElement('afterend', jsonButton);
targetDiv.insertAdjacentElement('afterend', document.createElement('br'));
targetDiv.insertAdjacentElement('afterend', csvButton);
