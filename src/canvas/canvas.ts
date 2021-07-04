import './canvas.scss'

const canvas = document.getElementById("canvas") as HTMLCanvasElement
export const context = canvas.getContext("2d")

const changeResolution = () => {
    canvas.width = innerHeight
    canvas.width = innerHeight
}


changeResolution()
addEventListener('resize',changeResolution)

