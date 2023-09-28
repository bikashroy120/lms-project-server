
export async function generateLast12MonthData(Model) {
    const last12Month = []

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+1);

    for(let i = 11; i>=0; i--){
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - i *28
        );
        const startDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate() - 28
        )

        const monthYear = endDate.toDateString("default",{
            day:"numeric",
            month:"short",
            year:"numeric"
        })

        const count = await Model.countDocuments({
            createdAt:{
                $gte:startDate,
                $lt:endDate
            }
        });
        last12Month.push({month:monthYear,count})
    }

    return { last12Month}

}