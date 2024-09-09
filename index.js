const express = require('express');
const app = express();
app.use(express.json());

const totalSeats = 80;
let seatMap = Array(12).fill().map((_, row) => Array(row < 11 ? 7 : 3).fill(0)); // 0: available, 1: booked

// Helper function to find and reserve seats
function reserveSeats(requestedSeats) {
    let reserved = [];
    for (let row = 0; row < seatMap.length; row++) {
        let availableSeats = seatMap[row].filter(seat => seat === 0).length;
        if (availableSeats >= requestedSeats) {
            // Reserve seats in the same row
            for (let seat = 0; seat < seatMap[row].length && requestedSeats > 0; seat++) {
                if (seatMap[row][seat] === 0) {
                    seatMap[row][seat] = 1;
                    reserved.push([row, seat]);
                    requestedSeats--;
                }
            }
            break;
        }
    }

    // If not enough seats in the same row, find nearby seats
    if (reserved.length === 0 && requestedSeats > 0) {
        for (let row = 0; row < seatMap.length; row++) {
            for (let seat = 0; seat < seatMap[row].length && requestedSeats > 0; seat++) {
                if (seatMap[row][seat] === 0) {
                    seatMap[row][seat] = 1;
                    reserved.push([row, seat]);
                    requestedSeats--;
                }
            }
        }
    }

    return reserved;
}

app.post('/reserve', (req, res) => {
    const { numSeats } = req.body;
    if (numSeats < 1 || numSeats > 7) {
        return res.status(400).json({ success: false, message: 'You can only reserve between 1 and 7 seats.' });
    }

    const reservedSeats = reserveSeats(numSeats);
    if (reservedSeats.length > 0) {
        return res.status(200).json({ success: true, reservedSeats });
    } else {
        return res.status(400).json({ success: false, message: 'Not enough seats available.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
