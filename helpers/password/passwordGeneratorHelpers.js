import generator from "generate-password"

export const randomPasswordGenerator = async()=>{
    return   generator.generate({
        length:12,
        numbers:true,
        uppercase:true,
        lowercase:true,
        symbols:true
    })
}