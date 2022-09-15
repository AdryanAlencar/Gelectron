const filterUsers = (commits) => {
    if(typeof commits === 'string') {
        commits = JSON.parse(commits);
    }
    var users = [];
    commits.log.logentry.forEach(commit => {
        if(!users.includes(commit.author)) {
            users.push(commit.author);
        }
    })

    users = users.sort().map(user => {
        return {
            username: user,
            alias: "",
            photo: ""
        }
    })

    return users;
}

const dateToSecondsTimestamp = (date) => {
    console.log(date)
    return Math.floor(date / 1000);
}

const filterMessages = (commits) => {
    if(typeof commits === 'string') {
        commits = JSON.parse(commits);
    }
    var messages = [];
    // commit date string(%d-%d-%dT%d:%d:%d) to timestamp seconds
    commits.log.logentry.forEach(commit => {
        if(!messages.includes(commit.msg)) {
            console.log(dateToSecondsTimestamp(new Date(commit.date).getTime()))
            messages.push({
                message: commit.msg,
                timestamp: dateToSecondsTimestamp(new Date(commit.date).getTime())
            });
        }
    });

    return messages;
}

export {
    filterUsers,
    filterMessages
}